from __future__ import annotations

from io import BytesIO
from typing import Optional


def _decode_text_bytes(raw_bytes: bytes) -> str:
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            text = raw_bytes.decode(encoding, errors="ignore").strip()
            if text:
                return text
        except Exception:
            continue
    return ""


def _extract_pdf_text_with_pymupdf(raw_bytes: bytes) -> str:
    try:
        import fitz  # type: ignore
    except ImportError:
        return ""

    try:
        pages = []
        doc = fitz.open(stream=raw_bytes, filetype="pdf")
        for page in doc:
            text = page.get_text()
            if text and text.strip():
                pages.append(text)
        return "\n".join(pages).strip()
    except Exception:
        return ""


def _extract_pdf_text_with_pypdf(raw_bytes: bytes) -> str:
    reader_cls = None
    try:
        from pypdf import PdfReader  # type: ignore

        reader_cls = PdfReader
    except ImportError:
        try:
            from PyPDF2 import PdfReader  # type: ignore

            reader_cls = PdfReader
        except ImportError:
            return ""

    try:
        reader = reader_cls(BytesIO(raw_bytes))
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text)
        return "\n".join(pages).strip()
    except Exception:
        return ""

def _extract_docx_text(raw_bytes: bytes) -> str:
    from docx import Document  # type: ignore

    doc = Document(BytesIO(raw_bytes))
    lines = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
    return "\n".join(lines).strip()


def extract_text_from_uploaded_file(uploaded_file) -> str:
    """Extract text from PDF/DOCX/TXT with robust fallbacks."""
    file_name = (getattr(uploaded_file, "name", "") or "").lower()
    content_type = (getattr(uploaded_file, "content_type", "") or "").lower()

    uploaded_file.seek(0)
    raw_bytes = uploaded_file.read()

    if not raw_bytes:
        return ""

    # PDF pipeline: PyMuPDF -> bytes decode fallback
    if file_name.endswith(".pdf") or "pdf" in content_type:
        try:
            text = _extract_pdf_text_with_pymupdf(raw_bytes)
            if text:
                return text
        except Exception:
            pass

        try:
            text = _extract_pdf_text_with_pypdf(raw_bytes)
            if text:
                return text
        except Exception:
            pass

        return _decode_text_bytes(raw_bytes)

    # DOCX pipeline
    if file_name.endswith(".docx") or "wordprocessingml.document" in content_type:
        try:
            text = _extract_docx_text(raw_bytes)
            if text:
                return text
        except Exception:
            pass

        return _decode_text_bytes(raw_bytes)

    # Generic text fallback
    return _decode_text_bytes(raw_bytes)
