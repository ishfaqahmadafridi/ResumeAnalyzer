from __future__ import annotations

from django.conf import settings


def gemini_is_configured() -> bool:
    return bool(getattr(settings, "CV_ANALYSIS_USE_LLM", False) and getattr(settings, "CV_GEMINI_MODEL", ""))


def generate_with_gemini(*args, **kwargs):
    return None
