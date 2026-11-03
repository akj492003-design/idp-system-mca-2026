import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from flask import Blueprint, current_app, jsonify, request, session, g
from argon2 import PasswordHasher, exceptions as argon_exceptions
from bson import ObjectId
from pymongo import ReturnDocument
from urllib.parse import quote
from pymongo.errors import DuplicateKeyError
from app.security import get_db, safe_user, login_required
from app.services.brevo import send_sms, send_email
from app import limiter
import requests

bp = Blueprint("auth", __name__)
_hasher = PasswordHasher()


def _otp_digest(code, salt):
    pepper = current_app.config["SECRET_KEY"]
    return hashlib.sha256(f"{pepper}:{salt}:{code}".encode()).hexdigest()


def _deliver(channel, destination, code, purpose):
    message = f"Your IDP System {purpose} code is {code}. It expires in 10 minutes. Do not share it."
    if channel == "sms":
        send_sms(destination, message)
    else:
        send_email(destination, f"IDP System {purpose.title()} code", f"<p>{message}</p>", message)


@bp.post("/register")
@limiter.limit("5 per hour")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("full_name") or data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""
    if len(name) < 2 or "@" not in email or len(password) < 10:
        return jsonify({"error": "validation_error", "message": "Provide your name, a valid email, and a password with at least 10 characters."}), 400
    if phone and len(phone) < 8:
        return jsonify({"error": "validation_error", "message": "Enter a valid phone number with country code."}), 400
    now = datetime.now(timezone.utc)
    user = {"full_name": name, "email": email, "password_hash": _hasher.hash(password),
            "created_at": now, "updated_at": now, "status": "active", "role": "user", "email_verified": False,
            "phone_verified": False, "auth_provider": "password"}
    # Sparse unique indexes still index empty strings; omit an absent phone entirely.
    if phone:
        user["phone"] = phone
    try:
        result = get_db().users.insert_one(user)
    except DuplicateKeyError:
        return jsonify({"error": "account_exists", "message": "An account with this email or phone already exists."}), 409
    user["_id"] = result.inserted_id
    return jsonify({"message": "Account created. Sign in to continue.", "user": safe_user(user)}), 201


@bp.post("/login")
@limiter.limit("10 per 15 minutes")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = get_db().users.find_one({"email": email})
    if not user or not user.get("password_hash"):
        return jsonify({"error": "invalid_credentials", "message": "Email or password is incorrect."}), 401
    try:
        valid = _hasher.verify(user["password_hash"], password)
    except (argon_exceptions.VerifyMismatchError, argon_exceptions.VerificationError, argon_exceptions.InvalidHashError):
        valid = False
    if not valid:
        return jsonify({"error": "invalid_credentials", "message": "Email or password is incorrect."}), 401
    if _hasher.check_needs_rehash(user["password_hash"]):
        get_db().users.update_one({"_id": user["_id"]}, {"$set": {"password_hash": _hasher.hash(password)}})
    session.clear()
    session["user_id"] = str(user["_id"])
    return jsonify({"message": "Signed in.", "user": safe_user(user)})


@bp.get("/me")
@login_required
def me():
    return jsonify({"authenticated": True, "user": safe_user(g.user)})


@bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Signed out."})


@bp.post("/google")
@limiter.limit("10 per 15 minutes")
def google_login():
    data = request.get_json(silent=True) or {}
    code = data.get("code")
    client_id = current_app.config["GOOGLE_OAUTH_CLIENT_ID"]
    client_secret = current_app.config["GOOGLE_OAUTH_CLIENT_SECRET"]
    if not client_id or not client_secret:
        return jsonify({"error": "oauth_not_configured", "message": "Google OAuth is not configured on the server."}), 503
    if not code:
        return jsonify({"error": "validation_error", "message": "Google authorization code is required."}), 400
    try:
        token_response = requests.post("https://oauth2.googleapis.com/token", data={
            "code": code, "client_id": client_id, "client_secret": client_secret,
            "redirect_uri": current_app.config["GOOGLE_REDIRECT_URI"], "grant_type": "authorization_code",
        }, timeout=15)
    except requests.RequestException:
        current_app.logger.exception("Google OAuth token endpoint unavailable")
        return jsonify({"error": "oauth_unavailable", "message": "Google sign-in is temporarily unavailable. Try again."}), 503
    if token_response.status_code != 200:
        try:
            google_error = token_response.json()
        except ValueError:
            google_error = {}

        error_code = str(google_error.get("error", "unknown"))[:100]
        error_description = str(
            google_error.get("error_description", "")
        )[:300]

        current_app.logger.warning(
            "Google OAuth token exchange rejected: "
            "status=%s error=%s description=%s redirect_uri=%s",
            token_response.status_code,
            error_code,
            error_description,
            current_app.config["GOOGLE_REDIRECT_URI"],
        )

        return jsonify({
            "error": "oauth_failed",
            "message": "Google sign-in could not be verified."
        }), 401
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        claims = id_token.verify_oauth2_token(token_response.json()["id_token"], google_requests.Request(), client_id)
    except Exception:
        return jsonify({"error": "oauth_failed", "message": "Google returned an invalid identity token."}), 401
    email = (claims.get("email") or "").lower()
    if not email or not claims.get("email_verified"):
        return jsonify({"error": "oauth_failed", "message": "Google account email is not verified."}), 401
    now = datetime.now(timezone.utc)
    user = get_db().users.find_one({"email": email})
    if not user:
        user_data = {"full_name": claims.get("name") or email.split("@")[0], "email": email,
                     "photo_url": claims.get("picture"), "password_hash": None, "created_at": now,
                     "updated_at": now, "status": "active", "role": "user", "email_verified": True,
                     "auth_provider": "google"}
        user_id = get_db().users.insert_one(user_data).inserted_id
        user = {**user_data, "_id": user_id}
    else:
        get_db().users.update_one({"_id": user["_id"]}, {"$set": {"email_verified": True, "photo_url": claims.get("picture"), "updated_at": now}})
    session.clear()
    session["user_id"] = str(user["_id"])
    return jsonify({"message": "Signed in with Google.", "user": safe_user(user)})


@bp.post("/password-reset/request-link")
@limiter.limit("5 per 15 minutes")
def request_password_reset_link():
    """Send a single-use password reset link; only the SHA-256 token hash is stored."""
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if not email or "@" not in email or len(email) > 254:
        return jsonify({"error": "validation_error", "message": "Enter a valid email address."}), 400

    # Identical response for known and unknown addresses prevents account enumeration.
    user = get_db().users.find_one({"email": email})
    if user:
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        now = datetime.now(timezone.utc)
        ttl_minutes = current_app.config["RESET_TOKEN_TTL_MINUTES"]
        get_db().reset_tokens.delete_many({"user_id": str(user["_id"]), "used": False})
        get_db().reset_tokens.insert_one({
            "token_hash": token_hash,
            "user_id": str(user["_id"]),
            "expires_at": now + timedelta(minutes=ttl_minutes),
            "created_at": now,
            "used": False,
            "purpose": "password_reset_link",
        })
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={quote(token)}"
        subject = "Reset your IDP account password"
        html = (
            "<p>We received a request to reset your IDP account password.</p>"
            f'<p><a href="{reset_url}">Reset password</a></p>'
            f"<p>This link expires in {ttl_minutes} minutes and can only be used once.</p>"
            "<p>If you did not request this change, ignore this email.</p>"
        )
        text = (
            "Reset your IDP password using this link: " + reset_url + "\n"
            f"This link expires in {ttl_minutes} minutes and can only be used once.\n"
            "If you did not request this change, ignore this email."
        )
        try:
            send_email(email, subject, html, text)
        except Exception:
            current_app.logger.exception("Password reset email delivery failed")
            get_db().reset_tokens.delete_one({"token_hash": token_hash})
            # Keep the public response identical for known/unknown addresses and
            # mail-provider failures; delivery details belong in server logs.

    return jsonify({"message": "If an account matches that address, a password reset link has been sent."})


@bp.post("/password-reset/request-otp")
@limiter.limit("5 per 15 minutes")
def request_password_reset_otp():
    data = request.get_json(silent=True) or {}
    channel = data.get("channel")
    destination = (data.get("destination") or "").strip()
    if channel not in ("email", "sms") or not destination:
        return jsonify({"error": "validation_error", "message": "Choose email or SMS and provide a destination."}), 400
    query = {"email": destination.lower()} if channel == "email" else {"phone": destination}
    user = get_db().users.find_one(query)
    challenge_id = secrets.token_urlsafe(24)
    code = f"{secrets.randbelow(1000000):06d}"
    salt = secrets.token_hex(16)
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    get_db().otp_challenges.insert_one({"challenge_id": challenge_id, "user_id": str(user["_id"]) if user else None,
        "channel": channel, "destination_hash": hashlib.sha256(destination.lower().encode()).hexdigest(),
        "purpose": "password_reset", "code_hash": _otp_digest(code, salt), "salt": salt,
        "attempts": 0, "expires_at": expires, "created_at": datetime.now(timezone.utc)})
    # Same response for unknown accounts prevents account enumeration.
    if user:
        try:
            _deliver(channel, destination, code, "password reset")
        except Exception:
            current_app.logger.exception("OTP delivery failed")
            get_db().otp_challenges.delete_one({"challenge_id": challenge_id})
            return jsonify({"error": "delivery_failed", "message": "OTP delivery is temporarily unavailable. Check the destination and try again."}), 503
    return jsonify({"challenge_id": challenge_id, "expires_in": 600, "message": "If the account exists, a verification code has been sent."})


@bp.post("/password-reset/verify-otp")
@limiter.limit("10 per 15 minutes")
def verify_password_reset_otp():
    data = request.get_json(silent=True) or {}
    challenge_id, code = data.get("challenge_id"), str(data.get("otp") or "")
    challenge = get_db().otp_challenges.find_one({"challenge_id": challenge_id, "purpose": "password_reset"})
    now = datetime.now(timezone.utc)
    expires_at = challenge.get("expires_at") if challenge else None
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if not challenge or not expires_at or expires_at <= now or challenge.get("attempts", 0) >= 5 or not challenge.get("user_id"):
        return jsonify({"error": "invalid_otp", "message": "The code is invalid or expired. Request a new code."}), 400
    expected = challenge["code_hash"]
    actual = _otp_digest(code, challenge["salt"])
    if not hmac.compare_digest(expected, actual):
        get_db().otp_challenges.update_one({"_id": challenge["_id"]}, {"$inc": {"attempts": 1}})
        return jsonify({"error": "invalid_otp", "message": "The verification code is incorrect."}), 400
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    get_db().reset_tokens.insert_one({"token_hash": token_hash, "user_id": challenge["user_id"],
        "expires_at": now + timedelta(minutes=10), "created_at": now, "used": False})
    get_db().otp_challenges.delete_one({"_id": challenge["_id"]})
    return jsonify({"reset_token": token, "expires_in": 600})


@bp.post("/password-reset/confirm")
@limiter.limit("5 per 15 minutes")
def confirm_password_reset():
    data = request.get_json(silent=True) or {}
    token = (data.get("token") or data.get("reset_token") or "").strip()
    password = data.get("new_password") or ""
    if not token or len(password) < 10:
        return jsonify({"error": "validation_error", "message": "A valid reset token and a password with at least 10 characters are required."}), 400
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc)
    # Atomically claim the token. Concurrent/replayed requests cannot use it twice.
    reset = get_db().reset_tokens.find_one_and_update(
        {"token_hash": token_hash, "used": False, "expires_at": {"$gt": now}},
        {"$set": {"used": True, "used_at": now}},
        return_document=ReturnDocument.BEFORE,
    )
    if not reset:
        return jsonify({"error": "invalid_reset_token", "message": "The reset link is invalid, expired, or has already been used. Request a new link."}), 400
    result = get_db().users.update_one(
        {"_id": ObjectId(reset["user_id"])},
        {"$set": {"password_hash": _hasher.hash(password), "updated_at": now}},
    )
    if result.matched_count != 1:
        current_app.logger.error("Password reset token referenced a missing user")
        return jsonify({"error": "invalid_reset_token", "message": "The account associated with this reset link no longer exists."}), 400
    get_db().reset_tokens.delete_many({"user_id": reset["user_id"], "_id": {"$ne": reset["_id"]}})
    return jsonify({"message": "Password updated. Sign in with your new password."})


@bp.post("/verification/send")
@login_required
@limiter.limit("3 per hour")
def send_verification_code():
    data = request.get_json(silent=True) or {}
    channel = data.get("channel", "sms")
    if channel == "email":
        destination = g.user.get("email")
    elif channel == "sms":
        destination = g.user.get("phone")
    else:
        return jsonify({"error": "validation_error", "message": "Channel must be email or sms."}), 400
    if not destination:
        return jsonify({"error": "missing_destination", "message": "Add an email address or phone number first."}), 400
    code = f"{secrets.randbelow(1000000):06d}"
    salt = secrets.token_hex(16)
    challenge_id = secrets.token_urlsafe(20)
    now = datetime.now(timezone.utc)
    get_db().otp_challenges.insert_one({"challenge_id": challenge_id, "user_id": g.user_id, "channel": channel,
        "purpose": "account_verification", "code_hash": _otp_digest(code, salt), "salt": salt,
        "attempts": 0, "expires_at": now + timedelta(minutes=10), "created_at": now})
    try:
        _deliver(channel, destination, code, "verification")
    except Exception:
        get_db().otp_challenges.delete_one({"challenge_id": challenge_id})
        return jsonify({"error": "delivery_failed", "message": "Verification message could not be sent."}), 503
    return jsonify({"challenge_id": challenge_id, "expires_in": 600})


@bp.post("/verification/confirm")
@login_required
def confirm_verification_code():
    data = request.get_json(silent=True) or {}
    challenge = get_db().otp_challenges.find_one({"challenge_id": data.get("challenge_id"), "user_id": g.user_id, "purpose": "account_verification"})
    code = str(data.get("otp") or "")
    now = datetime.now(timezone.utc)
    expires_at = challenge.get("expires_at") if challenge else None
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if not challenge or not expires_at or expires_at <= now or challenge.get("attempts", 0) >= 5 or not hmac.compare_digest(challenge["code_hash"], _otp_digest(code, challenge["salt"])):
        if challenge: get_db().otp_challenges.update_one({"_id": challenge["_id"]}, {"$inc": {"attempts": 1}})
        return jsonify({"error": "invalid_otp", "message": "The verification code is invalid or expired."}), 400
    field = "email_verified" if challenge["channel"] == "email" else "phone_verified"
    get_db().users.update_one({"_id": g.user["_id"]}, {"$set": {field: True, "updated_at": now}})
    get_db().otp_challenges.delete_one({"_id": challenge["_id"]})
    return jsonify({"message": "Contact verified."})
