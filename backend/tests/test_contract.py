from pathlib import Path
import json


def test_saved_model_metrics_are_real_and_complete():
    path = Path(__file__).parents[1] / "app" / "data" / "model_metrics.json"
    data = json.loads(path.read_text())
    assert data["dataset"]["test_samples"] == 1349
    assert {x["model"] for x in data["text_models"]} == {"Logistic Regression", "Linear SVM", "KNN Cosine", "Multinomial Naive Bayes"}
    assert {x["model"] for x in data["image_models"]} == {"ResNet18", "EfficientNet-B0", "MobileNetV2"}
    for metric in data["text_models"] + data["image_models"]:
        assert 0 <= metric["accuracy"] <= 1
        assert metric["test_samples"] == 1349
        assert set(metric["classification_report"]) == {"form", "invoice", "resume"}


def test_model_assets_exist():
    base = Path(__file__).parents[1] / "app" / "assets" / "models"
    assert (base / "linear_svm.joblib").exists()
    assert (base / "tfidf_vectorizer.joblib").exists()
    assert (base / "best_document_classifier.pdparams").exists()


def test_confusion_matrices_reconcile_with_held_out_test_set():
    path = Path(__file__).parents[1] / "app" / "data" / "model_metrics.json"
    data = json.loads(path.read_text())
    for model in data["text_models"] + data["image_models"]:
        matrix = model["confusion_matrix"]
        rows = matrix["rows"]
        assert matrix["labels"] == data["dataset"]["classes"]
        assert len(rows) == len(matrix["labels"])
        assert all(len(row) == len(matrix["labels"]) for row in rows)
        assert sum(sum(row) for row in rows) == data["dataset"]["test_samples"]
        diagonal_accuracy = sum(rows[i][i] for i in range(len(rows))) / data["dataset"]["test_samples"]
        assert abs(diagonal_accuracy - model["accuracy"]) < 1e-12
