from __future__ import annotations

import json
import os
from typing import Any
from urllib import error, parse, request

from django.conf import settings


GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def _configured_api_keys() -> list[str]:
    raw_keys = os.getenv("CV_GEMINI_API_KEYS", "")
    keys = [key.strip() for key in raw_keys.split(",") if key.strip()]
    primary_key = os.getenv("GEMINI_API_KEY", "").strip()
    if primary_key:
        keys.insert(0, primary_key)

    deduped: list[str] = []
    for key in keys:
        if key not in deduped:
            deduped.append(key)
    return deduped


def gemini_is_configured() -> bool:
    return bool(
        getattr(settings, "CV_ANALYSIS_USE_LLM", False)
        and getattr(settings, "CV_LLM_PROVIDER", "gemini") == "gemini"
        and getattr(settings, "CV_GEMINI_MODEL", "")
        and _configured_api_keys()
    )


def _extract_text_from_response(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    for candidate in candidates:
        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        chunks = [part.get("text", "") for part in parts if isinstance(part, dict) and part.get("text")]
        if chunks:
            return "\n".join(chunks).strip()
    return ""


def _strip_json_fence(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        lines = stripped.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        stripped = "\n".join(lines).strip()
    return stripped


def _extract_json_object(text: str) -> str:
    stripped = _strip_json_fence(text)
    if not stripped:
        return ""

    start = stripped.find("{")
    if start == -1:
        return ""

    depth = 0
    in_string = False
    escape = False
    for index in range(start, len(stripped)):
        char = stripped[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return stripped[start:index + 1]

    return stripped


def generate_with_gemini(
    prompt: str,
    *,
    model: str | None = None,
    response_schema: dict[str, Any] | None = None,
    system_instruction: str | None = None,
) -> dict[str, Any] | None:
    selected_model = model or getattr(settings, "CV_GEMINI_MODEL", "")
    if not selected_model:
        return None

    payload: dict[str, Any] = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }
    if response_schema:
        payload["generationConfig"]["responseSchema"] = response_schema
    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}],
        }

    body = json.dumps(payload).encode("utf-8")

    timeout_seconds = int(os.getenv("CV_GEMINI_TIMEOUT_SECONDS", "45"))
    for api_key in _configured_api_keys():
        endpoint = f"{GEMINI_API_BASE}/{parse.quote(selected_model)}:generateContent?key={parse.quote(api_key)}"
        req = request.Request(
            endpoint,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=timeout_seconds) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except (error.HTTPError, error.URLError, TimeoutError, json.JSONDecodeError):
            continue

        text = _extract_json_object(_extract_text_from_response(payload))
        if not text:
            continue

        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            continue

        if isinstance(parsed, dict):
            return parsed

    return None
