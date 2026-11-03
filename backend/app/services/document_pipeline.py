import csv
import json
import re
import tempfile
from pathlib import Path
from flask import current_app
from xml.etree import ElementTree

import fitz


def _paddle_ocr(image_path):
    try:
        from paddleocr import PaddleOCR
        engine = _paddle_ocr.engine
    except AttributeError:
        from paddleocr import PaddleOCR
        _paddle_ocr.engine = PaddleOCR(lang=current_app.config.get("PADDLEOCR_LANG", "en"))
        engine = _paddle_ocr.engine
    results = engine.predict(str(image_path))
    found = []
    for result in results or []:
        payload = getattr(result, "json", None)
        if callable(payload): payload = payload()
        if payload is None and isinstance(result, dict): payload = result
        if isinstance(payload, str):
            try: payload = json.loads(payload)
            except json.JSONDecodeError: payload = {}
        if isinstance(payload, dict):
            content = payload.get("res", payload)
            texts = content.get("rec_texts", []) if isinstance(content, dict) else []
            found.extend(str(t) for t in texts if t)
    if not found:
        # PaddleOCR 2.x compatibility, retained for local environments pinned to older wheels.
        try:
            legacy = engine.ocr(str(image_path), cls=True)
            for page in legacy or []:
                for item in page or []:
                    if len(item) > 1 and item[1]: found.append(str(item[1][0]))
        except Exception:
            pass
    return "\n".join(found)


def extract_pdf_pages(path):
    """Return extracted text page-by-page, preserving the source PDF order."""
    pages = []
    with fitz.open(path) as pdf:
        for page in pdf:
            text = page.get_text("text") or ""
            if len(text.strip()) < 25 and page.get_images(full=True):
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                with tempfile.NamedTemporaryFile(suffix=".png") as temp:
                    pix.save(temp.name)
                    text = (text + "\n" + _paddle_ocr(temp.name)).strip()
            pages.append(text)
    return pages


def extract_pdf(path):
    return "\n\n".join(extract_pdf_pages(path))


def extract_document_pages(path, extension):
    """Return page records for PDFs and a single logical page for other formats."""
    ext = extension.lower().lstrip(".")
    if ext == "pdf":
        return extract_pdf_pages(path)
    return [extract_document(path, ext)]


def extract_image(path):
    return _paddle_ocr(path)


def extract_document(path, extension):
    ext = extension.lower().lstrip(".")
    if ext == "pdf": return extract_pdf(path)
    if ext in {"png", "jpg", "jpeg", "tif", "tiff", "bmp", "webp"}: return extract_image(path)
    if ext in {"txt", "md", "rtf"}:
        return Path(path).read_text(encoding="utf-8", errors="replace")
    if ext == "csv":
        with open(path, encoding="utf-8-sig", errors="replace", newline="") as handle:
            return "\n".join(", ".join(row) for row in csv.reader(handle))
    if ext == "json":
        value = json.loads(Path(path).read_text(encoding="utf-8", errors="replace"))
        return json.dumps(value, ensure_ascii=False, indent=2, default=str)
    if ext == "bson":
        from bson import BSON
        value = BSON(Path(path).read_bytes()).decode()
        return json.dumps(value, ensure_ascii=False, indent=2, default=str)
    if ext == "xml":
        root = ElementTree.parse(path).getroot()
        return "\n".join(x.strip() for x in root.itertext() if x.strip())
    if ext == "docx":
        from docx import Document
        doc = Document(path)
        chunks = [p.text for p in doc.paragraphs if p.text.strip()]
        for table in doc.tables:
            chunks.extend(" | ".join(cell.text.strip() for cell in row.cells) for row in table.rows)
        return "\n".join(chunks)
    if ext in {"xlsx", "xlsm"}:
        from openpyxl import load_workbook
        workbook = load_workbook(path, read_only=True, data_only=True)
        chunks = []
        for sheet in workbook.worksheets:
            chunks.append(f"Sheet: {sheet.title}")
            for row in sheet.iter_rows(values_only=True):
                values = [str(v) for v in row if v is not None]
                if values: chunks.append(" | ".join(values))
        workbook.close()
        return "\n".join(chunks)
    if ext == "pptx":
        from pptx import Presentation
        presentation = Presentation(path)
        return "\n".join(shape.text for slide in presentation.slides for shape in slide.shapes if getattr(shape, "has_text_frame", False) and shape.text.strip())
    raise ValueError(f"Unsupported document type: .{ext}")


def extract_key_fields(text):
    """Extract conservative key fields; prefer false negatives to noisy field values."""
    patterns = {
        "emails": r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}",
        # Indian local numbers may include +91. Require ten local digits so dates
        # and short invoice/order references are not misclassified as phone numbers.
        "phone_numbers": r"(?<!\d)(?:\+91[\s.-]?)?(?:\d[\s.-]?){10}(?!\d)",
        "dates": r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:0?[1-9]|[12]\d|3[01])\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b",
        "amounts": r"(?:₹|INR|USD|\$|€)\s?\d[\d,]*(?:\.\d{1,2})?",
        # Only explicit invoice-number labels or standalone IDs whose INV prefix
        # is followed by a separator or digit (not the word "INVOICE").
        "invoice_numbers": r"(?:invoice\s*(?:number|no\.?|#)\s*[:#.-]?\s*([A-Z0-9][A-Z0-9/-]{2,})|\b(INV(?:[-/]\s*|\d)[A-Z0-9/-]{2,})\b)",
        "gstin": r"\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b",
    }
    result = {}
    for key, pattern in patterns.items():
        values = re.findall(pattern, text, flags=re.I)
        if key == "invoice_numbers":
            cleaned = [str(next((part for part in value if part), "")).strip() for value in values]
        else:
            cleaned = [str(value).strip() for value in values]
        cleaned = [value for value in cleaned if value]
        if cleaned:
            result[key] = list(dict.fromkeys(cleaned))[:20]
    return result


def build_insights(text, classification):
    sentences = re.split(r"(?<=[.!?])\s+", re.sub(r"\s+", " ", text).strip())
    summary = " ".join(s for s in sentences[:3] if s)[:700]
    fields = extract_key_fields(text)
    return {
        "summary": summary or "No readable text was extracted from this document.",
        "key_fields": fields,
        "classification": classification,
        "word_count": len(text.split()),
        "character_count": len(text),
    }
