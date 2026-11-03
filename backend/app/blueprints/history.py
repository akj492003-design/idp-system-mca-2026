from datetime import timezone
from flask import Blueprint, jsonify, request, g
from app.security import login_required, get_db

bp = Blueprint("history", __name__)

@bp.get("")
@login_required
def get_history():
    page = max(1, request.args.get("page", 1, type=int))
    limit = min(100, max(1, request.args.get("limit", 30, type=int)))
    query = {"user_id": g.user_id}
    event_type = request.args.get("type")
    status = request.args.get("status")
    if event_type and event_type != "all": query["event_type"] = event_type
    if status and status != "all": query["status"] = status
    total = get_db().activities.count_documents(query)
    rows = get_db().activities.find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit)
    events = []
    for item in rows:
        created = item.get("created_at")
        raw_type = item.get("event_type", "activity")
        event_types = {"upload": "Document Uploaded", "processing_started": "OCR Processing Started", "processing_retry": "OCR Processing Retried", "scan_completed": "Document Completed", "scan_failed": "OCR Processing Failed", "delete": "Document Deleted"}
        raw_status = item.get("status", "completed")
        statuses = {"queued": "In Progress", "processing": "Processing", "completed": "Success", "failed": "Failed"}
        events.append({"id": str(item["_id"]), "documentId": item.get("document_id"),
            "type": event_types.get(raw_type, "Document Uploaded"), "status": statuses.get(raw_status, "Success"),
            "fileName": item.get("file_name", "Document"), "description": item.get("description", ""),
            "timestamp": created.replace(tzinfo=timezone.utc).isoformat() if created and created.tzinfo is None else (created.isoformat() if created else ""), "user": "system"})
    return jsonify({"events": events, "pagination": {"page": page, "limit": limit, "total": total, "pages": (total+limit-1)//limit}})
