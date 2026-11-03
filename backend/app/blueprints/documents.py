
import os
import uuid
from io import BytesIO
from datetime import datetime, timezone
from pathlib import Path

from flask import Blueprint, current_app, jsonify, request, g, send_file
from werkzeug.utils import secure_filename
from bson import ObjectId
from gridfs.errors import NoFile
from pymongo import ReturnDocument

from app.security import login_required, get_db
from app.services.quota import consume_upload_slot, current_quota, QuotaExceeded


bp = Blueprint("documents", __name__)

ALLOWED = {
    "pdf", "png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp",
    "docx", "xlsx", "xlsm", "pptx", "txt", "md", "rtf",
    "csv", "json", "xml", "bson"
}


def _serialize(doc, include_result=False):
    created = doc.get("created_at")

    result = {
        "id": str(doc["_id"]),
        "name": doc.get("file_name"),
        "file_name": doc.get("file_name"),
        "type": doc.get("extension", "").upper(),
        "extension": doc.get("extension"),
        "mime_type": doc.get("mime_type"),
        "size": doc.get("size", 0),
        "status": doc.get("status", "queued"),
        "folder": doc.get("folder", ""),
        "tags": doc.get("tags", []),
        "archived": doc.get("archived", False),
        "progress": int(doc.get("progress", 0)),
        "current_stage": doc.get("current_stage", "File Uploaded"),
        "created_at": created.isoformat() if created else None,
        "updated_at": (
            doc.get("updated_at").isoformat()
            if doc.get("updated_at") else None
        ),
        "classification": (
            doc.get("result", {}).get("classification")
            if doc.get("result") else None
        ),
        "download_url": f"/api/documents/{doc['_id']}/download"
    }

    if include_result and doc.get("result"):
        result["result"] = doc["result"]

    if doc.get("error_message"):
        result["error_message"] = doc["error_message"]

    return result


def _get_gridfs_file_id(doc):
    """Return a valid BSON ObjectId for a stored GridFS file."""
    file_id = doc.get("gridfs_file_id")

    if isinstance(file_id, ObjectId):
        return file_id

    if isinstance(file_id, str) and ObjectId.is_valid(file_id):
        return ObjectId(file_id)

    return None


def _read_document_content(doc):
    """
    Retrieve document bytes from GridFS.

    Retain support for old records that use storage_path.
    """
    gridfs_file_id = _get_gridfs_file_id(doc)

    if gridfs_file_id is not None:
        try:
            bucket = current_app.extensions["gridfs_bucket"]

            with bucket.open_download_stream(gridfs_file_id) as grid_out:
                return grid_out.read()

        except Exception:
            current_app.logger.exception(
                "Failed to retrieve document from GridFS"
            )
            return None

    # Backward compatibility with existing local-storage records.
    storage_path = doc.get("storage_path")

    if storage_path:
        try:
            path = Path(storage_path)

            if path.is_file():
                return path.read_bytes()

        except OSError:
            current_app.logger.exception(
                "Failed to retrieve legacy document"
            )

    return None


def _delete_document_content(doc):
    """Delete stored file content, raising on failures that need a retry."""
    raw_file_id = doc.get("gridfs_file_id")
    gridfs_file_id = _get_gridfs_file_id(doc)

    if raw_file_id is not None:
        if gridfs_file_id is None:
            raise ValueError("The document contains an invalid GridFS file ID.")

        bucket = current_app.extensions["gridfs_bucket"]

        try:
            bucket.delete(gridfs_file_id)
        except NoFile:
            # A previous deletion may have removed the file before the
            # document record could be deleted. Treat this as idempotent.
            current_app.logger.info(
                "GridFS file %s was already absent during deletion",
                gridfs_file_id
            )

        return

    if doc.get("storage_type") == "gridfs":
        raise ValueError("The GridFS document is missing its file ID.")

    # Legacy local-storage cleanup. Missing files are already cleaned up;
    # permission and filesystem errors must propagate so the caller does
    # not remove the MongoDB document record and report false success.
    storage_path = doc.get("storage_path")

    if storage_path:
        Path(storage_path).unlink(missing_ok=True)


@bp.post("")
@login_required
def upload_document():
    file = request.files.get("file") or request.files.get("document")

    if not file or not file.filename:
        return jsonify({
            "error": "missing_file",
            "message": "Choose a document to upload."
        }), 400

    original_name = secure_filename(file.filename)
    ext = Path(original_name).suffix.lower().lstrip(".")

    if ext not in ALLOWED:
        return jsonify({
            "error": "unsupported_file_type",
            "message": f".{ext or 'unknown'} files are not supported."
        }), 415

    if ext == "pdf" and file.mimetype != "application/pdf":
        return jsonify({
            "error": "invalid_mime_type",
            "message": "PDF uploads must use the application/pdf MIME type."
        }), 415

    # Determine uploaded file size.
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(0)

    if size <= 0:
        return jsonify({
            "error": "empty_file",
            "message": "The selected file is empty."
        }), 400

    if size > current_app.config["MAX_CONTENT_LENGTH"]:
        return jsonify({
            "error": "file_too_large",
            "message": (
                f"The selected file exceeds the "
                f"{current_app.config['MAX_UPLOAD_MB']} MB upload limit."
            )
        }), 413

    # Enforce upload quota.
    try:
        quota = consume_upload_slot(g.user_id)

    except QuotaExceeded as exc:
        until = (
            exc.cooldown_until.isoformat()
            if exc.cooldown_until else None
        )

        return jsonify({
            "error": "upload_quota_exceeded",
            "message": str(exc),
            "cooldown_until": until,
            "quota": current_quota(g.user_id)
        }), 429

    document_id = uuid.uuid4().hex
    gridfs_file_id = None
    record = None
    now = datetime.now(timezone.utc)

    try:
        # Upload the document directly into MongoDB GridFS.
        bucket = current_app.extensions["gridfs_bucket"]

        file.stream.seek(0)

        gridfs_file_id = bucket.upload_from_stream(
            original_name,
            file.stream,
            metadata={
                "public_id": document_id,
                "user_id": g.user_id,
                "extension": ext,
                "mime_type": file.mimetype or "application/octet-stream",
                "size": size
            }
        )

        # Store the GridFS reference in the document record.
        record = {
            "_id": ObjectId(),
            "public_id": document_id,
            "user_id": g.user_id,
            "file_name": original_name,
            "extension": ext,
            "mime_type": file.mimetype or "application/octet-stream",
            "size": size,
            "gridfs_file_id": gridfs_file_id,
            "storage_type": "gridfs",
            "status": "queued",
            "folder": "",
            "tags": [],
            "archived": False,
            "created_at": now,
            "updated_at": now
        }

        get_db().documents.insert_one(record)

        get_db().activities.insert_one({
            "user_id": g.user_id,
            "document_id": document_id,
            "event_type": "upload",
            "status": "queued",
            "file_name": original_name,
            "created_at": now,
            "description": "Document uploaded"
        })

        # Send the document ID to the Celery worker.
        current_app.extensions["celery"].send_task(
            "app.tasks.process_document",
            args=[str(record["_id"])]
        )

    except Exception:
        current_app.logger.exception(
            "Upload could not be stored or queued"
        )

        # Clean up uploaded GridFS content if a later operation fails.
        if gridfs_file_id is not None:
            try:
                current_app.extensions["gridfs_bucket"].delete(
                    gridfs_file_id
                )
            except Exception:
                current_app.logger.exception(
                    "GridFS upload cleanup failed"
                )

        try:
            if record is not None:
                get_db().documents.delete_one({
                    "_id": record["_id"],
                    "user_id": g.user_id
                })

                get_db().activities.delete_one({
                    "user_id": g.user_id,
                    "document_id": document_id,
                    "event_type": "upload"
                })

            # Restore the consumed quota slot.
            if quota.get("plan") == "basic":
                get_db().upload_usage.update_one(
                    {
                        "user_id": g.user_id,
                        "used": {"$gt": 0}
                    },
                    {
                        "$inc": {"used": -1},
                        "$unset": {"cooldown_until": ""}
                    }
                )

            elif quota.get("plan") == "intermediate":
                get_db().subscription_usage.update_one(
                    {
                        "user_id": g.user_id,
                        "used": {"$gt": 0}
                    },
                    {"$inc": {"used": -1}}
                )

        except Exception:
            current_app.logger.exception(
                "Upload rollback failed"
            )

        return jsonify({
            "error": "processing_unavailable",
            "message": (
                "The scan queue is unavailable. "
                "Check MongoDB, Redis and the Celery worker, then retry."
            )
        }), 503

    return jsonify({
        "message": "Upload accepted for processing.",
        "document": _serialize(record),
        "quota": quota
    }), 202


@bp.get("")
@login_required
def list_documents():
    page = max(1, request.args.get("page", 1, type=int))
    limit = min(100, max(1, request.args.get("limit", 20, type=int)))

    query = {"user_id": g.user_id}

    if request.args.get("archived") in ("true", "false"):
        query["archived"] = request.args.get("archived") == "true"

    if request.args.get("status"):
        query["status"] = request.args["status"]

    if request.args.get("q"):
        query["file_name"] = {
            "$regex": request.args["q"],
            "$options": "i"
        }

    total = get_db().documents.count_documents(query)

    cursor = (
        get_db().documents.find(query)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return jsonify({
        "items": [_serialize(doc) for doc in cursor],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit
        },
        "quota": current_quota(g.user_id)
    })


@bp.get("/<document_id>")
@login_required
def get_document(document_id):
    if ObjectId.is_valid(document_id):
        doc = get_db().documents.find_one({
            "_id": ObjectId(document_id),
            "user_id": g.user_id
        })
    else:
        doc = get_db().documents.find_one({
            "public_id": document_id,
            "user_id": g.user_id
        })

    if not doc:
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    return jsonify({
        "document": _serialize(doc, include_result=True)
    })


@bp.get("/<document_id>/preview")
@login_required
def preview_document(document_id):
    if not ObjectId.is_valid(document_id):
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    doc = get_db().documents.find_one({
        "_id": ObjectId(document_id),
        "user_id": g.user_id
    })

    previewable = {
        "pdf", "png", "jpg", "jpeg",
        "tif", "tiff", "bmp", "webp"
    }

    if not doc or doc.get("extension") not in previewable:
        return jsonify({
            "error": "preview_unavailable",
            "message": (
                "This document type cannot be previewed in the browser."
            )
        }), 404

    content = _read_document_content(doc)

    if content is None:
        return jsonify({
            "error": "preview_unavailable",
            "message": "The document file could not be retrieved."
        }), 404

    response = send_file(
        BytesIO(content),
        as_attachment=False,
        download_name=doc["file_name"],
        mimetype=doc.get("mime_type"),
        conditional=True
    )

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = "default-src 'none'; sandbox"

    return response


@bp.get("/<document_id>/download")
@login_required
def download_document(document_id):
    if not ObjectId.is_valid(document_id):
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    doc = get_db().documents.find_one({
        "_id": ObjectId(document_id),
        "user_id": g.user_id
    })

    if not doc:
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    content = _read_document_content(doc)

    if content is None:
        return jsonify({
            "error": "not_found",
            "message": "Document file not found."
        }), 404

    return send_file(
        BytesIO(content),
        as_attachment=True,
        download_name=doc["file_name"],
        mimetype=doc.get("mime_type")
    )


@bp.patch("/<document_id>")
@login_required
def update_document(document_id):
    if not ObjectId.is_valid(document_id):
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    data = request.get_json(silent=True) or {}

    updates = {
        "updated_at": datetime.now(timezone.utc)
    }

    for field in ("folder", "tags", "archived"):
        if field in data:
            if field == "folder" and isinstance(data[field], str):
                updates[field] = data[field][:80]

            elif field == "tags" and isinstance(data[field], list):
                updates[field] = [
                    str(x)[:40] for x in data[field][:20]
                ]

            elif field == "archived" and isinstance(data[field], bool):
                updates[field] = data[field]

    if "file_name" in data or "name" in data:
        name = secure_filename(
            str(data.get("file_name", data.get("name", ""))).strip()
        )

        if not name:
            return jsonify({
                "error": "validation_error",
                "message": "A valid file name is required."
            }), 400

        current = get_db().documents.find_one(
            {
                "_id": ObjectId(document_id),
                "user_id": g.user_id
            },
            {"extension": 1}
        )

        if not current:
            return jsonify({
                "error": "not_found",
                "message": "Document not found."
            }), 404

        if Path(name).suffix.lower().lstrip(".") != current.get("extension", ""):
            return jsonify({
                "error": "validation_error",
                "message": (
                    "Renaming cannot change the original file extension."
                )
            }), 400

        updates["file_name"] = name

    result = get_db().documents.find_one_and_update(
        {
            "_id": ObjectId(document_id),
            "user_id": g.user_id
        },
        {"$set": updates},
        return_document=ReturnDocument.AFTER
    )

    if not result:
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    return jsonify({
        "document": _serialize(result)
    })


@bp.delete("/<document_id>")
@login_required
def delete_document(document_id):
    if not ObjectId.is_valid(document_id):
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    document_filter = {
        "_id": ObjectId(document_id),
        "user_id": g.user_id
    }
    doc = get_db().documents.find_one(document_filter)

    if not doc:
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    # Remove the stored bytes first. If GridFS or local storage is unavailable,
    # retain the document record so the user can retry deletion.
    try:
        _delete_document_content(doc)
    except Exception:
        current_app.logger.exception(
            "Document file deletion failed; retaining document record"
        )
        return jsonify({
            "error": "file_deletion_failed",
            "message": (
                "The document file could not be deleted. "
                "The document record has been retained; please retry."
            )
        }), 503

    # Delete metadata only after file cleanup has succeeded (or the GridFS
    # file was already absent). This operation is ownership-scoped as well.
    try:
        delete_result = get_db().documents.delete_one(document_filter)
    except Exception:
        current_app.logger.exception(
            "Document file was cleaned up but metadata deletion failed"
        )
        return jsonify({
            "error": "document_deletion_failed",
            "message": (
                "The file cleanup completed, but the document record "
                "could not be removed. Please retry deletion."
            )
        }), 503

    if delete_result.deleted_count != 1:
        return jsonify({
            "error": "not_found",
            "message": "Document not found."
        }), 404

    # Activity history is best-effort: the document and file are already gone.
    try:
        get_db().activities.insert_one({
            "user_id": g.user_id,
            "document_id": document_id,
            "event_type": "delete",
            "status": "completed",
            "file_name": doc["file_name"],
            "created_at": datetime.now(timezone.utc),
            "description": "Document deleted"
        })
    except Exception:
        current_app.logger.exception(
            "Document was deleted, but its activity entry could not be saved"
        )

    return jsonify({
        "message": "Document deleted."
    })
