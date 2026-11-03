from datetime import datetime, timezone
from flask import Blueprint, jsonify, request, g
from app.security import login_required, get_db

bp = Blueprint("settings", __name__)
DEFAULTS = {
    "theme": "navy", "preferredModel": "auto",
    "textModels": ["Logistic Regression", "Linear SVM", "KNN (Cosine)", "Multinomial Naive Bayes"],
    "imageModels": ["ResNet18", "MobileNetV2", "EfficientNet-B0"],
    "formats": ["PDF", "JPG", "PNG", "JPEG", "DOCX", "XLSX", "PPTX", "TXT", "CSV", "BSON", "JSON", "XML"],
    "threshold": 70, "lowAction": "Mark for manual review", "maxSize": "10 MB",
    "retention": "Keep until manually deleted", "ocrDisplay": "Show status (Required / Completed / Failed)",
    "switches": {"rejectState": True, "ocrState": True, "showState": True, "preserveState": True}, "collapsed": {},
    "managedFolders": ["Invoices", "Forms", "Resumes", "College", "Personal", "Work"],
    "managedTags": [
        {"name": "Important", "tone": "violet"}, {"name": "Urgent", "tone": "rose"},
        {"name": "Reviewed", "tone": "emerald"}, {"name": "Pending", "tone": "amber"},
    ]
}

@bp.get("")
@login_required
def get_settings():
    doc = get_db().settings.find_one({"user_id": g.user_id})
    return jsonify({"settings": {**DEFAULTS, **(doc.get("settings", {}) if doc else {})}})

@bp.put("")
@login_required
def put_settings():
    incoming = request.get_json(silent=True) or {}
    # Store only known keys; enforce accepted values for user-controlled configuration.
    settings = {**DEFAULTS, **{k: v for k, v in incoming.items() if k in DEFAULTS}}
    settings["theme"] = "light" if settings.get("theme") == "light" else "navy"
    settings["threshold"] = min(90, max(50, int(settings.get("threshold", 70))))
    if not isinstance(settings.get("switches"), dict): settings["switches"] = DEFAULTS["switches"].copy()
    settings["switches"] = {k: bool(settings["switches"].get(k, DEFAULTS["switches"][k])) for k in DEFAULTS["switches"]}
    folders = settings.get("managedFolders", DEFAULTS["managedFolders"])
    settings["managedFolders"] = list(dict.fromkeys(str(item).strip()[:80] for item in folders if isinstance(item, str) and item.strip()))[:100] if isinstance(folders, list) else DEFAULTS["managedFolders"][:]
    tags = settings.get("managedTags", DEFAULTS["managedTags"])
    if isinstance(tags, list):
        settings["managedTags"] = [{"name": str(item.get("name", "")).strip()[:40], "tone": str(item.get("tone", "sky"))[:20]} for item in tags if isinstance(item, dict) and str(item.get("name", "")).strip()][:100]
    else:
        settings["managedTags"] = DEFAULTS["managedTags"][:]
    now = datetime.now(timezone.utc)
    get_db().settings.update_one({"user_id": g.user_id}, {"$set": {"settings": settings, "updated_at": now}, "$setOnInsert": {"user_id": g.user_id, "created_at": now}}, upsert=True)
    return jsonify({"message": "Settings saved.", "settings": settings})
