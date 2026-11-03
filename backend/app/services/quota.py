from datetime import datetime, timedelta, timezone
from pymongo import ReturnDocument
from flask import current_app

FREE_UPLOAD_LIMIT = 5
FREE_COOLDOWN = timedelta(hours=24)

class QuotaExceeded(Exception):
    def __init__(self, cooldown_until, message="Get subscription for more uploads or wait 24 hours to upload again."):
        self.cooldown_until = cooldown_until
        super().__init__(message)


def _active_subscription(db, uid, now):
    return db.subscriptions.find_one({"user_id": uid, "status": "active", "$or": [{"ends_at": None}, {"ends_at": {"$gt": now}}]}, sort=[("created_at", -1)])


def _utc(value):
    if value is None:
        return None
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)


def _subscription_period(db, sub, now):
    start = _utc(sub.get("period_started_at") or sub.get("created_at") or now)
    if now >= start + timedelta(days=30):
        period_filter = {"_id": sub["_id"]}
        if sub.get("period_started_at") is None:
            period_filter["period_started_at"] = {"$exists": False}
        else:
            period_filter["period_started_at"] = sub.get("period_started_at")
        db.subscriptions.update_one(period_filter, {"$set": {"period_started_at": now}})
        refreshed = db.subscriptions.find_one({"_id": sub["_id"]}) or sub
        start = _utc(refreshed.get("period_started_at") or now)
    return start


def consume_upload_slot(uid):
    db = current_app.extensions["mongo_db"]
    now = datetime.now(timezone.utc)
    sub = _active_subscription(db, uid, now)
    plan = sub.get("plan_id", "basic") if sub else "basic"

    if plan == "unlimited":
        return {"plan": plan, "limit": None, "used": None, "remaining": None, "cooldown_until": None, "locked": False}

    if plan == "intermediate":
        start = _subscription_period(db, sub, now)
        # A unique per-user counter makes the 20-upload entitlement atomic under concurrent requests.
        db.subscription_usage.update_one(
            {"user_id": uid},
            {"$setOnInsert": {"user_id": uid, "period_started_at": start, "used": 0}},
            upsert=True,
        )
        counter = db.subscription_usage.find_one({"user_id": uid}) or {"used": 0, "period_started_at": start}
        counter_start = _utc(counter.get("period_started_at"))
        if counter_start != start:
            db.subscription_usage.update_one(
                {"user_id": uid, "period_started_at": counter.get("period_started_at")},
                {"$set": {"period_started_at": start, "used": 0}},
            )
        updated = db.subscription_usage.find_one_and_update(
            {"user_id": uid, "period_started_at": start, "used": {"$lt": 20}},
            {"$inc": {"used": 1}, "$set": {"updated_at": now}},
            return_document=ReturnDocument.AFTER,
        )
        if not updated:
            latest = db.subscription_usage.find_one({"user_id": uid}) or {"used": 20}
            raise QuotaExceeded(start + timedelta(days=30), "The Intermediate plan has reached its 20-upload billing-period limit. Upgrade your plan or wait until the next billing period.")
        used = int(updated.get("used", 0))
        return {"plan": plan, "limit": 20, "used": used, "remaining": max(0, 20-used), "cooldown_until": None, "locked": used >= 20}

    # Ensure one counter document per account. Conditional increments prevent concurrent sixth uploads.
    db.upload_usage.update_one({"user_id": uid}, {"$setOnInsert": {"user_id": uid, "used": 0, "created_at": now}}, upsert=True)
    usage = db.upload_usage.find_one({"user_id": uid}) or {"used": 0}
    cooldown_until = _utc(usage.get("cooldown_until"))
    if cooldown_until and now < cooldown_until:
        raise QuotaExceeded(cooldown_until)
    if cooldown_until and now >= cooldown_until:
        db.upload_usage.update_one({"user_id": uid, "cooldown_until": {"$lte": now}}, {"$set": {"used": 0}, "$unset": {"cooldown_until": ""}})

    updated = db.upload_usage.find_one_and_update(
        {"user_id": uid, "used": {"$lt": FREE_UPLOAD_LIMIT}, "$or": [{"cooldown_until": {"$exists": False}}, {"cooldown_until": None}]},
        {"$inc": {"used": 1}, "$set": {"updated_at": now}},
        return_document=ReturnDocument.AFTER,
    )
    if not updated:
        latest = db.upload_usage.find_one({"user_id": uid}) or {}
        until = _utc(latest.get("cooldown_until")) or (now + FREE_COOLDOWN)
        if latest.get("used", 0) >= FREE_UPLOAD_LIMIT and not latest.get("cooldown_until"):
            db.upload_usage.update_one({"user_id": uid, "used": FREE_UPLOAD_LIMIT, "$or": [{"cooldown_until": {"$exists": False}}, {"cooldown_until": None}]}, {"$set": {"cooldown_until": until}})
        raise QuotaExceeded(until)

    used = int(updated.get("used", 0))
    if used >= FREE_UPLOAD_LIMIT:
        cooldown_until = now + FREE_COOLDOWN
        db.upload_usage.update_one({"user_id": uid, "used": FREE_UPLOAD_LIMIT, "$or": [{"cooldown_until": {"$exists": False}}, {"cooldown_until": None}]}, {"$set": {"cooldown_until": cooldown_until}})
    else:
        cooldown_until = None
    return {"plan": "basic", "limit": 5, "used": used, "remaining": max(0, 5-used), "cooldown_until": cooldown_until, "locked": used >= FREE_UPLOAD_LIMIT}


def current_quota(uid):
    db = current_app.extensions["mongo_db"]
    now = datetime.now(timezone.utc)
    sub = _active_subscription(db, uid, now)
    plan = sub.get("plan_id", "basic") if sub else "basic"
    if plan == "unlimited":
        return {"plan": plan, "used": None, "limit": None, "remaining": None, "locked": False, "cooldown_until": None}
    if plan == "intermediate":
        start = _subscription_period(db, sub, now)
        counter = db.subscription_usage.find_one({"user_id": uid}) or {}
        counter_start = _utc(counter.get("period_started_at"))
        if counter_start != start:
            used = 0
        else:
            used = int(counter.get("used", 0))
        return {"plan": plan, "used": used, "limit": 20, "remaining": max(0, 20-used), "locked": used >= 20, "cooldown_until": None}
    usage = db.upload_usage.find_one({"user_id": uid}) or {"used": 0}
    until = _utc(usage.get("cooldown_until"))
    if until and now >= until:
        db.upload_usage.update_one(
            {"user_id": uid, "cooldown_until": {"$lte": now}},
            {"$set": {"used": 0, "updated_at": now}, "$unset": {"cooldown_until": ""}},
        )
        usage = db.upload_usage.find_one({"user_id": uid}) or {"used": 0}
        until = _utc(usage.get("cooldown_until"))
    used = int(usage.get("used", 0))
    if used >= FREE_UPLOAD_LIMIT and not until:
        # Repair legacy counters safely so the fifth upload always starts a bounded 24-hour lock.
        until = now + FREE_COOLDOWN
        db.upload_usage.update_one({"user_id": uid, "used": {"$gte": FREE_UPLOAD_LIMIT}, "$or": [{"cooldown_until": {"$exists": False}}, {"cooldown_until": None}]}, {"$set": {"cooldown_until": until}})
    locked = bool(until and now < until)
    return {"plan": "basic", "used": used, "limit": 5, "remaining": max(0, 5-used), "locked": locked, "cooldown_until": until if locked else None}

