import json
from pathlib import Path
from datetime import datetime, timezone
from flask import Blueprint, jsonify, g
from app.security import login_required, get_db
from app.services.quota import current_quota

bp = Blueprint("dashboard", __name__)


def _evaluation_payload(db=None, user_id=None):
    data_path = Path(__file__).resolve().parents[1] / "data" / "model_metrics.json"
    if not data_path.exists():
        return None
    payload = json.loads(data_path.read_text(encoding="utf-8"))
    selected = next((item for item in payload.get("text_models", []) if item.get("selected_model")), None)
    if not selected:
        return None
    accuracy_rows = [
        {"model": model["model"], "accuracy": round(model["accuracy"] * 100, 2)}
        for model in payload.get("text_models", []) + payload.get("image_models", [])
    ]
    metric_rows = [
        {"model": model["model"], **{key: round(model[key] * 100, 2) for key in ("precision", "recall", "f1_score")}}
        for model in payload.get("text_models", []) + payload.get("image_models", [])
    ]
    class_report = selected.get("classification_report", {})
    per_class = [
        {"class": label, "precision": round(row["precision"] * 100, 2),
         "recall": round(row["recall"] * 100, 2), "f1_score": round(row["f1_score"] * 100, 2)}
        for label, row in class_report.items() if isinstance(row, dict) and "precision" in row
    ]
    model_keys = ["Linear SVM", "Logistic Regression", "ResNet18"]
    model_lookup = {item["model"]: item for item in payload.get("text_models", []) + payload.get("image_models", [])}
    radar = []
    for metric_key, metric_label in (("accuracy", "Accuracy"), ("precision", "Precision"), ("recall", "Recall"), ("f1_score", "F1")):
        row = {"metric": metric_label}
        for model_key in model_keys:
            if model_key in model_lookup:
                row[model_key] = round(model_lookup[model_key][metric_key] * 100, 2)
        radar.append(row)
    report_rows = [
        {"class": label, "precision": round(row["precision"] * 100, 2),
         "recall": round(row["recall"] * 100, 2), "f1_score": round(row["f1_score"] * 100, 2),
         "support": row.get("support")}
        for label, row in class_report.items() if isinstance(row, dict) and "precision" in row
    ]
    inference_buckets = {}
    if db is not None and user_id:
        live_docs = db.documents.find(
            {"user_id": user_id, "status": "completed", "result.classification.inference_time_ms": {"$gt": 0}},
            {"result.classification.model": 1, "result.classification.inference_time_ms": 1},
        ).limit(1000)
        for document in live_docs:
            classification = (document.get("result") or {}).get("classification") or {}
            model_name = classification.get("model")
            duration = classification.get("inference_time_ms")
            if model_name and isinstance(duration, (int, float)) and duration > 0:
                bucket = inference_buckets.setdefault(model_name, {"total": 0.0, "count": 0})
                bucket["total"] += float(duration)
                bucket["count"] += 1
    inference_rows = [
        {"model": name, "inference_time": round(values["total"] / values["count"], 3), "observations": values["count"]}
        for name, values in sorted(inference_buckets.items())
    ]
    return {
        "selected_model": selected.get("model"),
        "metrics": {key: selected[key] for key in ("accuracy", "precision", "recall", "f1_score")},
        "classification_report": report_rows,
        "charts": {
            "accuracy_comparison": accuracy_rows,
            "metrics_comparison": metric_rows,
            # Reconstructed from the provided test prediction CSV for the validation-selected Linear SVM.
            "confusion_matrix": selected.get("confusion_matrix"),
            "per_class_performance": per_class,
            "model_comparison": radar,
            "inference_time_comparison": inference_rows,
        },
        "source": payload.get("dataset"),
    }


@bp.get("")
@login_required
def dashboard_summary():
    db = get_db()
    user_query = {"user_id": g.user_id}
    total = db.documents.count_documents(user_query)
    completed = db.documents.count_documents({**user_query, "status": "completed"})
    processing = db.documents.count_documents({**user_query, "status": {"$in": ["queued", "processing"]}})
    failed = db.documents.count_documents({**user_query, "status": "failed"})
    recent = db.documents.find({**user_query, "archived": {"$ne": True}}).sort("created_at", -1).limit(6)
    recent_items = [{"id": str(d["_id"]), "name": d["file_name"], "type": d["extension"].upper(), "size": d["size"], "status": d["status"], "created_at": d["created_at"].isoformat(), "classification": d.get("result", {}).get("classification", {}).get("label")} for d in recent]
    latest = db.documents.find_one({**user_query, "status": "completed"}, sort=[("processed_at", -1)])
    latest_payload = None
    if latest:
        result = latest.get("result", {})
        classification = result.get("classification") or {}
        scores = classification.get("scores") or []
        insights = result.get("insights") or {}
        started = latest.get("started_at")
        processed = latest.get("processed_at")
        elapsed = (processed - started).total_seconds() if started and processed else None
        if elapsed is not None and elapsed < 0:
            elapsed = None
        preview_url = f"/api/documents/{latest['_id']}/preview" if latest.get("extension") in {"pdf", "png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp"} else None
        latest_payload = {
            "id": str(latest["_id"]), "file_name": latest.get("file_name"), "status": latest.get("status"),
            "current_stage": "Field Extraction", "preview_url": preview_url,
            "extracted_information": insights.get("key_fields", {}),
            "ocr_text": result.get("extracted_text", ""),
            "page_texts": result.get("page_texts", []),
            "prediction": {"predicted_class": classification.get("label"), "confidence_score": scores[0].get("score") if scores else None,
                           "model_name": classification.get("model"), "processing_time": f"{elapsed:.2f} s" if elapsed is not None else "—"},
            "class_probabilities": [{"class": item.get("label"), "probability": round(float(item.get("score", 0)) * 100, 2)} for item in scores],
        }
    elapsed_values = []
    for item in db.documents.find({**user_query, "status": "completed", "started_at": {"$exists": True}, "processed_at": {"$exists": True}}, {"started_at": 1, "processed_at": 1}).limit(100):
        try:
            seconds = (item["processed_at"] - item["started_at"]).total_seconds()
            if seconds >= 0:
                elapsed_values.append(seconds)
        except (TypeError, KeyError):
            continue
    avg = f"{sum(elapsed_values)/len(elapsed_values):.2f} s" if elapsed_values else "—"
    return jsonify({"stats": {"total_documents": total, "completed": completed, "processing": processing, "failed": failed, "average_processing_time": avg},
                    "recent_uploads": recent_items, "latest_document": latest_payload,
                    "evaluation": _evaluation_payload(db, g.user_id), "quota": current_quota(g.user_id),
                    "generated_at": datetime.now(timezone.utc).isoformat()})
