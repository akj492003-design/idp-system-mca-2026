from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_session import Session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient, ASCENDING, DESCENDING
from urllib.parse import urlsplit
from werkzeug.exceptions import HTTPException
from config import Config

session_ext = Session()
limiter = Limiter(key_func=get_remote_address, default_limits=[])


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY must be configured in backend/.env before the API starts.")

    mongo_client = MongoClient(app.config["MONGODB_URI"], serverSelectionTimeoutMS=4000)
    app.config["SESSION_MONGODB"] = mongo_client
    Session(app)

    db = mongo_client[app.config["MONGODB_DB"]]
    app.extensions["mongo_client"] = mongo_client
    app.extensions["mongo_db"] = db

    db.users.create_index([("email", ASCENDING)], unique=True, sparse=True)
    db.users.create_index([("phone", ASCENDING)], unique=True, sparse=True)
    db.documents.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
    db.documents.create_index([("user_id", ASCENDING), ("status", ASCENDING)])
    db.activities.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
    db.otp_challenges.create_index("expires_at", expireAfterSeconds=0)
    db.reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    db.upload_usage.create_index([("user_id", ASCENDING)], unique=True)
    db.subscription_usage.create_index([("user_id", ASCENDING)], unique=True)
    db.subscriptions.create_index([("user_id", ASCENDING), ("status", ASCENDING)])
    db.settings.create_index([("user_id", ASCENDING)], unique=True)

    CORS(app, origins=app.config["FRONTEND_ORIGINS"], supports_credentials=True,
         allow_headers=["Content-Type", "X-Requested-With", "Authorization"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

    @app.before_request
    def reject_untrusted_browser_origin():
        # CORS controls response visibility; this separately blocks cross-origin browser writes.
        if request.method not in {"POST", "PUT", "PATCH", "DELETE"} or request.endpoint == "payments.razorpay_webhook":
            return None
        origin = request.headers.get("Origin")
        referer = request.headers.get("Referer")
        if not origin and referer:
            parsed = urlsplit(referer)
            origin = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else None
        if origin and origin not in app.config["FRONTEND_ORIGINS"]:
            return jsonify({"error": "untrusted_origin", "message": "This request origin is not allowed."}), 403
        return None

    limiter.init_app(app)

    from app.blueprints.auth import bp as auth_bp
    from app.blueprints.documents import bp as documents_bp
    from app.blueprints.dashboard import bp as dashboard_bp
    from app.blueprints.history import bp as history_bp
    from app.blueprints.classification import bp as classification_bp
    from app.blueprints.settings import bp as settings_bp
    from app.blueprints.subscriptions import bp as subscriptions_bp
    from app.blueprints.payments import bp as payments_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(documents_bp, url_prefix="/api/documents")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(history_bp, url_prefix="/api/history")
    app.register_blueprint(classification_bp, url_prefix="/api/classification")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(subscriptions_bp, url_prefix="/api/subscriptions")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")

    from app.tasks.document_tasks import register_tasks
    celery = register_tasks(app)
    app.extensions["celery"] = celery

    @app.get("/api/health")
    def health():
        mongo_state = "ok"
        redis_state = "ok"
        try:
            db.command("ping")
        except Exception:
            mongo_state = "unavailable"
        try:
            from redis import Redis
            Redis.from_url(app.config["REDIS_URL"], socket_connect_timeout=1).ping()
        except Exception:
            redis_state = "unavailable"
        status = 200 if mongo_state == redis_state == "ok" else 503
        return jsonify({"ok": status == 200, "services": {"mongodb": mongo_state, "redis": redis_state}}), status

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify({"error": "file_too_large", "message": f"Maximum upload size is {app.config['MAX_UPLOAD_MB']} MB."}), 413

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "not_found", "message": "The requested resource was not found."}), 404

    @app.errorhandler(429)
    def rate_limited(_error):
        return jsonify({"error": "rate_limited", "message": "Too many requests. Please try again later."}), 429

    @app.errorhandler(Exception)
    def api_error(error):
        if isinstance(error, HTTPException):
            return jsonify({"error": error.name.lower().replace(" ", "_"), "message": error.description}), error.code
        app.logger.exception("Unhandled API exception", exc_info=error)
        return jsonify({"error": "internal_server_error", "message": "An unexpected server error occurred."}), 500

    return app
