from __future__ import annotations

from django.conf import settings


def get_runtime_flags() -> dict[str, str | bool | int]:
    return {
        "use_llm": getattr(settings, "CV_ANALYSIS_USE_LLM", False),
        "provider": getattr(settings, "CV_LLM_PROVIDER", "gemini"),
        "model": getattr(settings, "CV_GEMINI_MODEL", ""),
        "max_prompt_chars": getattr(settings, "CV_GEMINI_MAX_PROMPT_CHARS", 4000),
    }
