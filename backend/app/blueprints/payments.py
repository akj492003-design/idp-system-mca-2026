import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone
from flask import Blueprint, current_app, jsonify, request, g
from app.security import login_required, get_db
from app.blueprints.subscriptions import PLANS

bp = Blueprint("payments", __name__)


def _get_plan(plan_id):
    return next((p for p in PLANS if p["id"] == plan_id and plan_id != "basic"), None)


def _amount(plan, cycle):
    if cycle not in ("monthly", "yearly"): raise ValueError("Billing cycle must be monthly or yearly.")
    return int(plan["monthly_price"] if cycle == "monthly" else plan["yearly_price"])


@bp.post("/order")
@login_required
def create_order():
    data = request.get_json(silent=True) or {}
    plan = _get_plan(data.get("plan_id"))
    if not plan: return jsonify({"error": "invalid_plan", "message": "Select a paid subscription plan."}), 400
    try: amount = _amount(plan, data.get("cycle", "monthly"))
    except ValueError as exc: return jsonify({"error": "validation_error", "message": str(exc)}), 400
    if not current_app.config["RAZORPAY_KEY_ID"] or not current_app.config["RAZORPAY_KEY_SECRET"]:
        return jsonify({"error": "payment_not_configured", "message": "Online payment is not configured. Add Razorpay test or live credentials to the backend environment."}), 503
    try:
        import razorpay
        client = razorpay.Client(auth=(current_app.config["RAZORPAY_KEY_ID"], current_app.config["RAZORPAY_KEY_SECRET"]))
        order = client.order.create({"amount": amount * 100, "currency": "INR", "receipt": f"idp_{g.user_id[:10]}_{int(datetime.now(timezone.utc).timestamp())}", "notes": {"user_id": g.user_id, "plan_id": plan["id"], "cycle": data.get("cycle", "monthly")}})
    except Exception:
        current_app.logger.exception("Razorpay order creation failed")
        return jsonify({"error": "payment_provider_error", "message": "Could not create a payment order."}), 502
    now = datetime.now(timezone.utc)
    get_db().payments.insert_one({"user_id": g.user_id, "provider": "razorpay", "order_id": order["id"],
        "plan_id": plan["id"], "cycle": data.get("cycle", "monthly"), "amount": amount,
        "currency": "INR", "status": "created", "created_at": now})
    return jsonify({"order_id": order["id"], "amount": amount * 100, "currency": "INR", "key_id": current_app.config["RAZORPAY_KEY_ID"], "plan": plan})


@bp.post("/verify")
@login_required
def verify_payment():
    data = request.get_json(silent=True) or {}
    order_id = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature = data.get("razorpay_signature")
    record = get_db().payments.find_one({"user_id": g.user_id, "order_id": order_id, "status": "created"})
    if not record:
        paid = get_db().payments.find_one({"user_id": g.user_id, "order_id": order_id, "status": "paid", "payment_id": payment_id})
        if paid:
            active = get_db().subscriptions.find_one({"user_id": g.user_id, "payment_id": payment_id, "status": "active"})
            return jsonify({"message": "Payment already verified.", "subscription": {"plan_id": paid["plan_id"], "cycle": paid["cycle"], "status": "active" if active else "paid"}})
        return jsonify({"error": "invalid_payment", "message": "Payment order was not found."}), 404
    secret = current_app.config["RAZORPAY_KEY_SECRET"]
    expected = hmac.new(secret.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256).hexdigest()
    if not signature or not hmac.compare_digest(expected, signature):
        get_db().payments.update_one({"_id": record["_id"]}, {"$set": {"status": "verification_failed", "updated_at": datetime.now(timezone.utc)}})
        return jsonify({"error": "invalid_signature", "message": "Payment signature verification failed."}), 400
    now = datetime.now(timezone.utc)
    claimed = get_db().payments.update_one(
        {"_id": record["_id"], "status": "created"},
        {"$set": {"status": "paid", "payment_id": payment_id, "signature": signature, "paid_at": now}},
    )
    if claimed.modified_count != 1:
        paid = get_db().payments.find_one({"_id": record["_id"], "status": "paid", "payment_id": payment_id})
        if paid:
            return jsonify({"message": "Payment already verified.", "subscription": {"plan_id": paid["plan_id"], "cycle": paid["cycle"], "status": "active"}})
        return jsonify({"error": "payment_already_processed", "message": "This payment order has already been processed."}), 409
    duration = timedelta(days=365 if record["cycle"] == "yearly" else 30)
    get_db().subscriptions.update_many({"user_id": g.user_id, "status": "active"}, {"$set": {"status": "superseded", "updated_at": now}})
    get_db().subscriptions.insert_one({"user_id": g.user_id, "plan_id": record["plan_id"], "cycle": record["cycle"],
        "status": "active", "created_at": now, "period_started_at": now, "ends_at": now + duration,
        "payment_id": payment_id})
    return jsonify({"message": "Payment verified and subscription activated.", "subscription": {"plan_id": record["plan_id"], "cycle": record["cycle"], "status": "active", "ends_at": (now+duration).isoformat()}})


@bp.post("/webhook")
def razorpay_webhook():
    secret = current_app.config.get("RAZORPAY_WEBHOOK_SECRET")
    if not secret: return jsonify({"error": "webhook_not_configured"}), 503
    body = request.get_data()
    supplied = request.headers.get("X-Razorpay-Signature", "")
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(supplied, expected): return jsonify({"error": "invalid_signature"}), 400
    payload = request.get_json(silent=True) or {}
    entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    order_id = entity.get("order_id")
    if payload.get("event") == "payment.captured" and order_id:
        payment = get_db().payments.find_one({"order_id": order_id, "status": "created"})
        try:
            captured_amount = int(entity.get("amount", -1))
        except (TypeError, ValueError):
            captured_amount = -1
        expected_amount = int(payment["amount"]) * 100 if payment else None
        if payment and entity.get("currency") == payment.get("currency", "INR") and captured_amount == expected_amount:
            now = datetime.now(timezone.utc)
            claimed = get_db().payments.update_one(
                {"_id": payment["_id"], "status": "created"},
                {"$set": {"status": "paid", "payment_id": entity.get("id"), "paid_at": now}},
            )
            if claimed.modified_count == 1:
                duration = timedelta(days=365 if payment["cycle"] == "yearly" else 30)
                get_db().subscriptions.update_many({"user_id": payment["user_id"], "status": "active"}, {"$set": {"status": "superseded", "updated_at": now}})
                get_db().subscriptions.insert_one({"user_id": payment["user_id"], "plan_id": payment["plan_id"], "cycle": payment["cycle"], "status": "active", "created_at": now, "period_started_at": now, "ends_at": now+duration, "payment_id": entity.get("id")})
    return jsonify({"received": True})
