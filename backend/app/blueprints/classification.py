from flask import Blueprint, jsonify, request, g
from app.security import login_required, get_db

bp = Blueprint("classification", __name__)

@bp.get("")
@login_required
def classification_summary():
    db = get_db()
    query = {"user_id": g.user_id, "status": "completed"}
    docs = list(db.documents.find(query).sort("processed_at", -1).limit(500))
    counts = {"form": 0, "invoice": 0, "resume": 0, "unclassified": 0}
    rows = []
    filter_type = request.args.get("type")
    for doc in docs:
        classification = doc.get("result", {}).get("classification", {})
        label = classification.get("label", "unclassified")
        counts[label] = counts.get(label, 0) + 1
        if filter_type and filter_type != "all" and label != filter_type: continue
        rows.append({"id": str(doc["_id"]), "name": doc.get("file_name"), "type": doc.get("extension", "").upper(),
            "category": label, "model": classification.get("model"), "status": doc.get("status"),
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "confidence": (classification.get("scores") or [{}])[0].get("score")})
    return jsonify({"stats": {"total": len(docs), "form": counts["form"], "invoice": counts["invoice"], "resume": counts["resume"], "unclassified": counts["unclassified"]}, "categories": counts, "results": rows})


@bp.get("/models")
@login_required
def model_performance():
    import json
    from pathlib import Path
    data_path = Path(__file__).resolve().parents[1] / "data" / "model_metrics.json"
    if not data_path.exists():
        return jsonify({"error": "metrics_missing", "message": "Saved model evaluation metrics are missing."}), 503
    return jsonify(json.loads(data_path.read_text(encoding="utf-8")))
