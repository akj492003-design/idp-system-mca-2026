from datetime import datetime, timezone
from flask import Blueprint, jsonify, g
from app.security import login_required, get_db
from app.services.quota import current_quota

bp = Blueprint("subscriptions", __name__)
PLANS = [
    {"id": "basic", "name": "Basic", "monthly_price": 0, "yearly_price": 0, "uploads": "5 uploads / 24 hours", "description": "For trying the IDP system", "features": ["5 document uploads", "PDF, images and office formats", "OCR and classification", "24-hour cooldown after 5 uploads"]},
    {"id": "intermediate", "name": "Intermediate", "monthly_price": 199, "yearly_price": 1910, "uploads": "20 uploads / billing month", "description": "For regular document workflows", "features": ["20 document uploads per 30-day billing period", "OCR and classification", "Document history and management"]},
    {"id": "unlimited", "name": "Unlimited", "monthly_price": 399, "yearly_price": 3830, "uploads": "Unlimited uploads", "description": "For intensive document processing", "features": ["Unlimited document uploads", "OCR and classification", "Document history and management"]},
]

@bp.get("/plans")
def plans():
    return jsonify({"plans": PLANS, "currency": "INR", "yearly_discount_percent": 20})

@bp.get("/current")
@login_required
def current_subscription():
    now = datetime.now(timezone.utc)
    active = get_db().subscriptions.find_one({"user_id": g.user_id, "status": "active", "$or": [{"ends_at": None}, {"ends_at": {"$gt": now}}]}, sort=[("created_at", -1)])
    return jsonify({"subscription": {"plan_id": active.get("plan_id"), "cycle": active.get("cycle"), "status": active.get("status"), "ends_at": active.get("ends_at").isoformat() if active.get("ends_at") else None} if active else {"plan_id": "basic", "cycle": "free", "status": "active", "ends_at": None}, "quota": current_quota(g.user_id)})
