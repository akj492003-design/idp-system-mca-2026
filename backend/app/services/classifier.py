import json
import math
import time
from pathlib import Path
from functools import lru_cache
import numpy as np
import joblib
from flask import current_app


@lru_cache(maxsize=4)
def _text_assets(assets_path):
    base = Path(assets_path)
    vectorizer = joblib.load(base / "tfidf_vectorizer.joblib")
    model = joblib.load(base / "linear_svm.joblib")
    mapping = json.loads((base / "class_mapping.json").read_text(encoding="utf-8"))
    inverse = {int(v): k for k, v in mapping.items()}
    return vectorizer, model, inverse


def classify_text(text):
    assets = str(current_app.config["MODEL_ASSETS_PATH"])
    try:
        vectorizer, model, class_names = _text_assets(assets)
        started = time.perf_counter()
        features = vectorizer.transform([text])
        prediction = int(model.predict(features)[0])
        margins = model.decision_function(features)[0]
        inference_time_ms = (time.perf_counter() - started) * 1000
        if np.ndim(margins) == 0:
            margins = np.array([float(margins)])
        shifted = np.asarray(margins, dtype=float) - float(np.max(margins))
        exp_values = np.exp(np.clip(shifted, -50, 50))
        relative = exp_values / exp_values.sum()
        scores = [{"label": class_names.get(i, str(i)), "score": float(relative[i])} for i in range(len(relative))]
        scores.sort(key=lambda item: item["score"], reverse=True)
        return {"label": class_names.get(prediction, "unknown"), "model": "Linear SVM", "score_type": "normalized decision-margin score (not calibrated probability)", "scores": scores, "inference_time_ms": round(inference_time_ms, 3)}
    except Exception as exc:
        current_app.logger.exception("Text classifier failed")
        return {"label": "unclassified", "model": "Linear SVM", "score_type": "unavailable", "scores": [], "error": str(exc)}


def classify_image(path):
    if not current_app.config.get("ENABLE_IMAGE_CLASSIFIER", True):
        return None
    try:
        import paddle
        from PIL import Image
        import paddle.vision.transforms as T
        from paddle.vision.models import resnet18
        base = Path(current_app.config["MODEL_ASSETS_PATH"])
        checkpoint = base / "best_document_classifier.pdparams"
        if not checkpoint.exists(): return None
        model = resnet18(num_classes=3)
        state = paddle.load(str(checkpoint))
        model.set_state_dict(state)
        model.eval()
        transform = T.Compose([
            T.Resize((224, 224)), T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        image = Image.open(path).convert("RGB")
        batch = paddle.to_tensor(np.expand_dims(transform(image).numpy(), 0), dtype="float32")
        # Measure the model forward pass only; checkpoint loading and image
        # preprocessing are not inference latency.
        started = time.perf_counter()
        with paddle.no_grad():
            logits = model(batch)
            probs = paddle.nn.functional.softmax(logits, axis=1).numpy()[0]
        inference_time_ms = (time.perf_counter() - started) * 1000
        labels = ["form", "invoice", "resume"]
        scores = [{"label": labels[i], "score": float(probs[i])} for i in range(3)]
        scores.sort(key=lambda item: item["score"], reverse=True)
        return {"label": scores[0]["label"], "model": "ResNet18", "score_type": "softmax probability", "scores": scores, "inference_time_ms": round(inference_time_ms, 3)}
    except Exception:
        current_app.logger.exception("ResNet18 image inference unavailable; continuing with OCR text")
        return None
