
from datetime import datetime, timezone
from pathlib import Path
from tempfile import NamedTemporaryFile
import shutil

from celery import Celery
from bson import ObjectId

from app.security import get_db
from app.services.document_pipeline import extract_document_pages, build_insights
from app.services.classifier import classify_text, classify_image


def _materialize_document(flask_app, doc):
    """
    Retrieve a document from GridFS into a temporary local file.

    Older documents that still contain storage_path are supported.
    Returns (processing_path, is_temporary).
    """

    gridfs_file_id = doc.get("gridfs_file_id")

    if gridfs_file_id is not None:
        # Support both BSON ObjectId and serialized string IDs.
        if isinstance(gridfs_file_id, str):
            if not ObjectId.is_valid(gridfs_file_id):
                raise ValueError("Invalid GridFS file ID.")

            gridfs_file_id = ObjectId(gridfs_file_id)

        bucket = flask_app.extensions["gridfs_bucket"]

        extension = Path(
            doc.get("file_name", "")
        ).suffix

        temp_path = None

        try:
            with bucket.open_download_stream(gridfs_file_id) as grid_file:
                with NamedTemporaryFile(
                    mode="wb",
                    suffix=extension,
                    prefix="idp_worker_",
                    delete=False
                ) as temp_file:

                    temp_path = Path(temp_file.name)

                    shutil.copyfileobj(
                        grid_file,
                        temp_file,
                        length=1024 * 1024
                    )

            return temp_path, True

        except Exception:
            if temp_path is not None:
                temp_path.unlink(missing_ok=True)

            raise

    # Backward compatibility for older local-storage documents.
    storage_path = doc.get("storage_path")

    if storage_path:
        legacy_path = Path(storage_path)

        if legacy_path.is_file():
            return legacy_path, False

    raise FileNotFoundError(
        f"No accessible file found for document {doc.get('_id')}"
    )


def register_tasks(flask_app):
    celery = Celery(
        "docupilot",
        broker=flask_app.config["CELERY_BROKER_URL"],
        backend=flask_app.config["CELERY_RESULT_BACKEND"]
    )

    celery.conf.update(
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
        task_track_started=True,
        task_acks_late=True,
        worker_prefetch_multiplier=1,
        broker_connection_retry_on_startup=True,
        timezone="UTC",
        enable_utc=True
    )

    @celery.task(
        name="app.tasks.process_document",
        bind=True,
        max_retries=2
    )
    def process_document(self, document_id):
        with flask_app.app_context():

            db = flask_app.extensions["mongo_db"]

            doc = db.documents.find_one({
                "_id": ObjectId(document_id)
            })

            if not doc:
                return {"status": "missing"}

            now = datetime.now(timezone.utc)

            db.documents.update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {
                        "status": "processing",
                        "progress": 5,
                        "current_stage": "File Uploaded",
                        "started_at": now
                    }
                }
            )

            db.activities.insert_one({
                "user_id": doc["user_id"],
                "document_id": document_id,
                "event_type": "processing_started",
                "status": "processing",
                "file_name": doc["file_name"],
                "created_at": now,
                "description": "Document processing started"
            })

            processing_path = None
            is_temporary = False

            try:
                # Retrieve GridFS content or use a legacy local file.
                processing_path, is_temporary = _materialize_document(
                    flask_app,
                    doc
                )

                extension = doc["extension"]

                # Stage 1: Text extraction.
                db.documents.update_one(
                    {"_id": doc["_id"]},
                    {
                        "$set": {
                            "progress": 10,
                            "current_stage": "Text Extraction"
                        }
                    }
                )

                page_texts = extract_document_pages(
                    str(processing_path),
                    extension
                )

                text = "\n\n".join(page_texts)

                page_count = (
                    len(page_texts)
                    if extension == "pdf"
                    else None
                )

                # Stage 2: Document classification.
                db.documents.update_one(
                    {"_id": doc["_id"]},
                    {
                        "$set": {
                            "progress": 60,
                            "current_stage": "Document Classification"
                        }
                    }
                )

                classification = (
                    classify_text(text)
                    if len(text.strip()) >= 20
                    else None
                )

                # Image classification fallback.
                if classification is None and extension in {
                    "png", "jpg", "jpeg", "tif",
                    "tiff", "bmp", "webp"
                }:
                    classification = classify_image(
                        str(processing_path)
                    )

                if classification is None:
                    classification = {
                        "label": "unclassified",
                        "model": None,
                        "score_type": "unavailable",
                        "scores": []
                    }

                # Stage 3: Insights and field extraction.
                db.documents.update_one(
                    {"_id": doc["_id"]},
                    {
                        "$set": {
                            "progress": 82,
                            "current_stage": "Field Extraction"
                        }
                    }
                )

                insights = build_insights(
                    text,
                    classification
                )

                result = {
                    "extracted_text": text[:2_000_000],
                    "page_texts": [
                        page[:1_000_000]
                        for page in page_texts
                    ],
                    "text_truncated": len(text) > 2_000_000,
                    "classification": classification,
                    "insights": insights,
                    "page_count": page_count
                }

                finished_at = datetime.now(timezone.utc)

                # Save final processing results.
                db.documents.update_one(
                    {"_id": doc["_id"]},
                    {
                        "$set": {
                            "status": "completed",
                            "progress": 100,
                            "current_stage": "Completed",
                            "result": result,
                            "processed_at": finished_at,
                            "updated_at": finished_at
                        },
                        "$unset": {
                            "error_message": ""
                        }
                    }
                )

                db.activities.insert_one({
                    "user_id": doc["user_id"],
                    "document_id": document_id,
                    "event_type": "scan_completed",
                    "status": "completed",
                    "file_name": doc["file_name"],
                    "created_at": finished_at,
                    "description": (
                        f"Classified as "
                        f"{classification.get('label', 'unclassified')}"
                    )
                })

                return {
                    "status": "completed",
                    "document_id": document_id
                }

            except Exception as exc:
                flask_app.logger.exception(
                    "Document processing failed: %s",
                    document_id
                )

                now = datetime.now(timezone.utc)

                if self.request.retries < self.max_retries:

                    db.documents.update_one(
                        {"_id": doc["_id"]},
                        {
                            "$set": {
                                "status": "queued",
                                "progress": 0,
                                "current_stage": "Queued for retry",
                                "error_message": (
                                    "Temporary processing error; "
                                    "retry scheduled."
                                ),
                                "updated_at": now
                            }
                        }
                    )

                    db.activities.insert_one({
                        "user_id": doc["user_id"],
                        "document_id": document_id,
                        "event_type": "processing_retry",
                        "status": "queued",
                        "file_name": doc["file_name"],
                        "created_at": now,
                        "description": (
                            "Temporary error; retry scheduled"
                        )
                    })

                    raise self.retry(
                        exc=exc,
                        countdown=5
                    )

                db.documents.update_one(
                    {"_id": doc["_id"]},
                    {
                        "$set": {
                            "status": "failed",
                            "current_stage": "Failed",
                            "error_message": str(exc)[:500],
                            "updated_at": now
                        }
                    }
                )

                db.activities.insert_one({
                    "user_id": doc["user_id"],
                    "document_id": document_id,
                    "event_type": "scan_failed",
                    "status": "failed",
                    "file_name": doc["file_name"],
                    "created_at": now,
                    "description": (
                        "Document processing failed after retry attempts"
                    )
                })

                return {
                    "status": "failed",
                    "document_id": document_id
                }

            finally:
                # Always remove temporary GridFS downloads.
                # This also runs when Celery schedules a retry.
                if is_temporary and processing_path is not None:
                    try:
                        processing_path.unlink(missing_ok=True)

                    except OSError:
                        flask_app.logger.exception(
                            "Could not remove temporary document file"
                        )

    return celery
