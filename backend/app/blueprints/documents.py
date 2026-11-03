import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from flask import Blueprint, current_app, jsonify, request, g, send_file
from werkzeug.utils import secure_filename
from bson import ObjectId
from pymongo import ReturnDocument
from app.security import login_required, get_db
from app.services.quota import consume_upload_slot, current_quota, QuotaExceeded

bp = Blueprint("documents", __name__)
ALLOWED = {"pdf", "png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp", "docx", "xlsx", "xlsm", "pptx", "txt", "md", "rtf", "csv", "json", "xml", "bson"}


def _serialize(doc, include_result=False):
    created = doc.get("created_at")
    result = {"id": str(doc["_id"]), "name": doc.get("file_name"), "file_name": doc.get("file_name"),
        "type": doc.get("extension", "").upper(), "extension": doc.get("extension"),
        "mime_type": doc.get("mime_type"), "size": doc.get("size", 0), "status": doc.get("status", "queued"),
        "folder": doc.get("folder", ""), "tags": doc.get("tags", []), "archived": doc.get("archived", False),
        "progress": int(doc.get("progress", 0)), "current_stage": doc.get("current_stage", "File Uploaded"),
        "created_at": created.isoformat() if created else None,
        "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None,
        "classification": doc.get("result", {}).get("classification") if doc.get("result") else None,
        "download_url": f"/api/documents/{doc['_id']}/download"}
    if include_result and doc.get("result"):
        result["result"] = doc["result"]
    if doc.get("error_message"):
        result["error_message"] = doc["error_message"]
    return result


@bp.post("")
@login_required
def upload_document():
    file = request.files.get("file") or request.files.get("document")
    if not file or not file.filename:
        return jsonify({"error": "missing_file", "message": "Choose a document to upload."}), 400
    original_name = secure_filename(file.filename)
    ext = Path(original_name).suffix.lower().lstrip(".")
    if ext not in ALLOWED:
        return jsonify({"error": "unsupported_file_type", "message": f".{ext or 'unknown'} files are not supported."}), 415
    if ext == "pdf" and file.mimetype != "application/pdf":
        return jsonify({"error": "invalid_mime_type", "message": "PDF uploads must use the application/pdf MIME type."}), 415
    # The configurable upload cap is enforced both by Flask's request limit and by this stream check.
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(0)
    if size <= 0:
        return jsonify({"error": "empty_file", "message": "The selected file is empty."}), 400
    if size > current_app.config["MAX_CONTENT_LENGTH"]:
        return jsonify({"error": "file_too_large", "message": f"The selected file exceeds the {current_app.config['MAX_UPLOAD_MB']} MB upload limit."}), 413
    try:
        quota = consume_upload_slot(g.user_id)
    except QuotaExceeded as exc:
        until = exc.cooldown_until.isoformat() if exc.cooldown_until else None
        return jsonify({"error": "upload_quota_exceeded", "message": str(exc), "cooldown_until": until,
                        "quota": current_quota(g.user_id)}), 429

    document_id = uuid.uuid4().hex
    user_dir = current_app.config["FILE_STORAGE_PATH"] / g.user_id
    user_dir.mkdir(parents=True, exist_ok=True)
    storage_path = user_dir / f"{document_id}.{ext}"
    now = datetime.now(timezone.utc)
    try:
        file.save(storage_path)
        record = {"_id": ObjectId(), "public_id": document_id, "user_id": g.user_id, "file_name": original_name,
            "extension": ext, "mime_type": file.mimetype or "application/octet-stream", "size": size,
            "storage_path": str(storage_path), "status": "queued", "folder": "", "tags": [],
            "archived": False, "created_at": now, "updated_at": now}
        get_db().documents.insert_one(record)
        get_db().activities.insert_one({"user_id": g.user_id, "document_id": document_id, "event_type": "upload",
            "status": "queued", "file_name": original_name, "created_at": now, "description": "Document uploaded"})
        current_app.extensions["celery"].send_task("app.tasks.process_document", args=[str(record["_id"])])
    except Exception as exc:
        current_app.logger.exception("Upload could not be queued")
        try:
            storage_path.unlink(missing_ok=True)
            get_db().documents.delete_one({"public_id": document_id, "user_id": g.user_id})
            get_db().activities.delete_one({"user_id": g.user_id, "document_id": document_id, "event_type": "upload"})
            if quota.get("plan") == "basic":
                get_db().upload_usage.update_one({"user_id": g.user_id, "used": {"$gt": 0}}, {"$inc": {"used": -1}, "$unset": {"cooldown_until": ""}})
            elif quota.get("plan") == "intermediate":
                get_db().subscription_usage.update_one({"user_id": g.user_id, "used": {"$gt": 0}}, {"$inc": {"used": -1}})
        except Exception:
            pass
        return jsonify({"error": "processing_unavailable", "message": "The scan queue is unavailable. Start Redis and the Celery worker, then retry."}), 503
    return jsonify({"message": "Upload accepted for processing.", "document": _serialize(record), "quota": quota}), 202


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
        query["file_name"] = {"$regex": request.args["q"], "$options": "i"}
    total = get_db().documents.count_documents(query)
    cursor = get_db().documents.find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit)
    return jsonify({"items": [_serialize(d) for d in cursor], "pagination": {"page": page, "limit": limit, "total": total, "pages": (total+limit-1)//limit}, "quota": current_quota(g.user_id)})


@bp.get("/<document_id>")
@login_required
def get_document(document_id):
    doc = get_db().documents.find_one({"_id": ObjectId(document_id), "user_id": g.user_id}) if ObjectId.is_valid(document_id) else get_db().documents.find_one({"public_id": document_id, "user_id": g.user_id})
    if not doc: return jsonify({"error": "not_found", "message": "Document not found."}), 404
    return jsonify({"document": _serialize(doc, include_result=True)})


@bp.get("/<document_id>/preview")
@login_required
def preview_document(document_id):
    if not ObjectId.is_valid(document_id):
        return jsonify({"error": "not_found", "message": "Document not found."}), 404
    doc = get_db().documents.find_one({"_id": ObjectId(document_id), "user_id": g.user_id})
    previewable = {"pdf", "png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp"}
    if not doc or doc.get("extension") not in previewable or not Path(doc["storage_path"]).exists():
        return jsonify({"error": "preview_unavailable", "message": "This document type cannot be previewed in the browser."}), 404
    response = send_file(doc["storage_path"], as_attachment=False, download_name=doc["file_name"],
                         mimetype=doc.get("mime_type"), conditional=True)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = "default-src 'none'; sandbox"
    return response


@bp.get("/<document_id>/download")
@login_required
def download_document(document_id):
    doc = get_db().documents.find_one({"_id": ObjectId(document_id), "user_id": g.user_id}) if ObjectId.is_valid(document_id) else None
    if not doc or not Path(doc["storage_path"]).exists():
        return jsonify({"error": "not_found", "message": "Document file not found."}), 404
    return send_file(doc["storage_path"], as_attachment=True, download_name=doc["file_name"], mimetype=doc.get("mime_type"))


@bp.patch("/<document_id>")
@login_required
def update_document(document_id):
    if not ObjectId.is_valid(document_id): return jsonify({"error": "not_found", "message": "Document not found."}), 404
    data = request.get_json(silent=True) or {}
    updates = {"updated_at": datetime.now(timezone.utc)}
    for field in ("folder", "tags", "archived"):
        if field in data:
            if field == "folder" and isinstance(data[field], str): updates[field] = data[field][:80]
            elif field == "tags" and isinstance(data[field], list): updates[field] = [str(x)[:40] for x in data[field][:20]]
            elif field == "archived" and isinstance(data[field], bool): updates[field] = data[field]
    if "file_name" in data or "name" in data:
        name = secure_filename(str(data.get("file_name", data.get("name", ""))).strip())
        if not name: return jsonify({"error": "validation_error", "message": "A valid file name is required."}), 400
        current = get_db().documents.find_one({"_id": ObjectId(document_id), "user_id": g.user_id}, {"extension": 1})
        if not current: return jsonify({"error": "not_found", "message": "Document not found."}), 404
        if Path(name).suffix.lower().lstrip(".") != current.get("extension", ""):
            return jsonify({"error": "validation_error", "message": "Renaming cannot change the original file extension."}), 400
        updates["file_name"] = name
    result = get_db().documents.find_one_and_update({"_id": ObjectId(document_id), "user_id": g.user_id}, {"$set": updates}, return_document=ReturnDocument.AFTER)
    if not result: return jsonify({"error": "not_found", "message": "Document not found."}), 404
    return jsonify({"document": _serialize(result)})


@bp.delete("/<document_id>")
@login_required
def delete_document(document_id):
    if not ObjectId.is_valid(document_id): return jsonify({"error": "not_found", "message": "Document not found."}), 404
    doc = get_db().documents.find_one_and_delete({"_id": ObjectId(document_id), "user_id": g.user_id})
    if not doc: return jsonify({"error": "not_found", "message": "Document not found."}), 404
    try: Path(doc["storage_path"]).unlink(missing_ok=True)
    except OSError: current_app.logger.warning("Could not delete document file %s", doc["storage_path"])
    get_db().activities.insert_one({"user_id": g.user_id, "document_id": document_id, "event_type": "delete", "status": "completed", "file_name": doc["file_name"], "created_at": datetime.now(timezone.utc), "description": "Document deleted"})
    return jsonify({"message": "Document deleted."})
