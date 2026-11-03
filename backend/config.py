import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "")
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/?retryWrites=true&w=majority")
    MONGODB_DB = os.getenv("MONGODB_DB", "idp_system")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
    FRONTEND_ORIGINS = [x.strip() for x in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",") if x.strip()]
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_MB", "10")) * 1024 * 1024
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "10"))
    FILE_STORAGE_PATH = Path(os.getenv("FILE_STORAGE_PATH", str(BASE_DIR / "storage"))).resolve()
    MODEL_ASSETS_PATH = Path(os.getenv("MODEL_ASSETS_PATH", str(BASE_DIR / "app/assets/models"))).resolve()
    SESSION_TYPE = "mongodb"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    SESSION_COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "Lax")
    SESSION_MONGODB_DB = os.getenv("MONGODB_DB", "idp_system")
    SESSION_MONGODB_COLLECT = "flask_sessions"
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24 * 7
    # Accept both the explicit Google names and the existing OAuth-prefixed names.
    GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", os.getenv("GOOGLE_OAUTH_CLIENT_ID", ""))
    GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", ""))
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "postmessage")
    BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
    BREVO_SMS_SENDER = os.getenv("BREVO_SMS_SENDER", "IDP System")
    BREVO_EMAIL_SENDER = os.getenv("BREVO_SENDER_EMAIL", os.getenv("BREVO_EMAIL_SENDER", ""))
    BREVO_EMAIL_SENDER_NAME = os.getenv("BREVO_EMAIL_SENDER_NAME", "IDP System")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    RESET_TOKEN_TTL_MINUTES = max(5, min(120, int(os.getenv("RESET_TOKEN_TTL_MINUTES", "30"))))
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    PADDLEOCR_LANG = os.getenv("PADDLEOCR_LANG", "en")
    ENABLE_IMAGE_CLASSIFIER = os.getenv("ENABLE_IMAGE_CLASSIFIER", "true").lower() == "true"
    RATELIMIT_STORAGE_URI = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    JSON_SORT_KEYS = False
