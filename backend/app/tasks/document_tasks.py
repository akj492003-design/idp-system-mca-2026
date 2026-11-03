from datetime import datetime, timezone
from pathlib import Path
from celery import Celery
from bson import ObjectId
from app.security import get_db
from app.services.document_pipeline import extract_document_pages, build_insights
from app.services.classifier import classify_text, classify_image


def register_tasks(flask_app):
    celery = Celery("docupilot", broker=flask_app.config["CELERY_BROKER_URL"], backend=flask_app.config["CELERY_RESULT_BACKEND"])
    celery.conf.update(task_serializer="json", result_serializer="json", accept_content=["json"],
                       task_track_started=True, task_acks_late=True, worker_prefetch_multiplier=1,
                       broker_connection_retry_on_startup=True, timezone="UTC", enable_utc=True)

    @celery.task(name="app.tasks.process_document", bind=True, max_retries=2)
    def process_document(self, document_id):
        with flask_app.app_context():
            db = flask_app.extensions["mongo_db"]
            doc = db.documents.find_one({"_id": ObjectId(document_id)})
            if not doc:
                return {"status": "missing"}
            now = datetime.now(timezone.utc)
            db.documents.update_one({"_id": doc["_id"]}, {"$set": {"status": "processing", "progress": 5, "current_stage": "File Uploaded", "started_at": now}})
            db.activities.insert_one({"user_id": doc["user_id"], "document_id": document_id,
                                      "event_type": "processing_started", "status": "processing",
                                      "file_name": doc["file_name"], "created_at": now,
                                      "description": "Document processing started"})
            try:
                extension = doc["extension"]
                db.documents.update_one({"_id": doc["_id"]}, {"$set": {"progress": 10, "current_stage": "Text Extraction"}})
                page_texts = extract_document_pages(doc["storage_path"], extension)
                text = "\n\n".join(page_texts)
                page_count = len(page_texts) if extension == "pdf" else None
                db.documents.update_one({"_id": doc["_id"]}, {"$set": {"progress": 60, "current_stage": "Document Classification"}})
                classification = classify_text(text) if len(text.strip()) >= 20 else None
                if classification is None and extension in {"png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp"}:
                    classification = classify_image(doc["storage_path"])
                if classification is None:
                    classification = {"label": "unclassified", "model": None, "score_type": "unavailable", "scores": []}
                db.documents.update_one({"_id": doc["_id"]}, {"$set": {"progress": 82, "current_stage": "Field Extraction"}})
                insights = build_insights(text, classification)
                result = {
                    "extracted_text": text[:2_000_000],
                    "page_texts": [page[:1_000_000] for page in page_texts],
                    "text_truncated": len(text) > 2_000_000,
                    "classification": classification,
                    "insights": insights,
                    "page_count": page_count,
                }
                finished_at = datetime.now(timezone.utc)
                db.documents.update_one({"_id": doc["_id"]}, {"$set": {
                    "status": "completed", "progress": 100, "current_stage": "Completed",
                    "result": result, "processed_at": finished_at, "updated_at": finished_at,
                }})
                db.activities.insert_one({"user_id": doc["user_id"], "document_id": document_id,
                    "event_type": "scan_completed", "status": "completed", "file_name": doc["file_name"],
                    "created_at": datetime.now(timezone.utc), "description": f"Classified as {classification.get('label', 'unclassified')}"})
                return {"status": "completed", "document_id": document_id}
            except Exception as exc:
                flask_app.logger.exception("Document processing failed: %s", document_id)
                now = datetime.now(timezone.utc)
                if self.request.retries < self.max_retries:
                    db.documents.update_one({"_id": doc["_id"]}, {"$set": {"status": "queued", "progress": 0, "current_stage": "Queued for retry", "error_message": "Temporary processing error; retry scheduled.", "updated_at": now}})
                    db.activities.insert_one({"user_id": doc["user_id"], "document_id": document_id,
                        "event_type": "processing_retry", "status": "queued", "file_name": doc["file_name"],
                        "created_at": now, "description": "Temporary error; retry scheduled"})
                    raise self.retry(exc=exc, countdown=5)
                db.documents.update_one({"_id": doc["_id"]}, {"$set": {"status": "failed", "current_stage": "Failed", "error_message": str(exc)[:500], "updated_at": now}})
                db.activities.insert_one({"user_id": doc["user_id"], "document_id": document_id,
                    "event_type": "scan_failed", "status": "failed", "file_name": doc["file_name"],
                    "created_at": now, "description": "Document processing failed after retry attempts"})
                return {"status": "failed", "document_id": document_id}

    return celery
