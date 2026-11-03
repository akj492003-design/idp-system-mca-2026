from functools import wraps
from flask import current_app, jsonify, session, g
from bson import ObjectId


def get_db():
    return current_app.extensions["mongo_db"]


def user_id():
    value = session.get("user_id")
    return str(value) if value else None


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        uid = user_id()
        if not uid:
            return jsonify({"error": "unauthorized", "message": "Please sign in to continue."}), 401
        user = get_db().users.find_one({"_id": ObjectId(uid)})
        if not user or user.get("status", "active") != "active":
            session.clear()
            return jsonify({"error": "unauthorized", "message": "Your session is no longer valid."}), 401
        g.user = user
        g.user_id = uid
        return view(*args, **kwargs)
    return wrapped


def safe_user(user):
    return {
        "id": str(user["_id"]),
        "full_name": user.get("full_name", ""),
        "name": user.get("full_name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "photo_url": user.get("photo_url"),
        "role": user.get("role", "user"),
    }
