from __future__ import annotations

import json
from typing import Any

from cv.analysis_engine_parts.gemini_client import generate_with_gemini


IMPROVE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING"},
        "sections": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "title": {"type": "STRING"},
                    "items": {"type": "ARRAY", "items": {"type": "STRING"}},
                },
                "required": ["title", "items"],
            },
        },
        "improvements": {"type": "ARRAY", "items": {"type": "STRING"}},
        "suggested_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
    },
    "required": ["name", "sections", "improvements", "suggested_skills"],
}

STRICT_SECTION_ORDER = [
    "About",
    "Experience",
    "Education",
    "Projects",
    "Skills",
    "Languages",
    "Contact",
]


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _clean_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def _normalize_sections(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []

    sections: list[dict[str, Any]] = []
    for section in value:
        if not isinstance(section, dict):
            continue
        title = _clean_text(section.get("title"))
        items = _clean_list(section.get("items"))
        if not title and not items:
            continue
        sections.append({"title": title or "Section", "items": items})
    return sections


def _apply_strict_order(sections: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_title = {str(section.get("title", "")).strip().lower(): section for section in sections}
    ordered: list[dict[str, Any]] = []

    for title in STRICT_SECTION_ORDER:
        existing = by_title.get(title.lower())
        if existing:
            ordered.append({"title": title, "items": _clean_list(existing.get("items"))})
        else:
            ordered.append({"title": title, "items": []})

    return ordered


def _normalize_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        payload = {}

    return {
        "name": _clean_text(payload.get("name")),
        "sections": _apply_strict_order(_normalize_sections(payload.get("sections"))),
        "improvements": _clean_list(payload.get("improvements")),
        "suggested_skills": _clean_list(payload.get("suggested_skills")),
    }


def _fallback_improve(cv_data: dict[str, Any]) -> dict[str, Any]:
    sections = _apply_strict_order(_normalize_sections(cv_data.get("sections")))
    improvements: list[str] = []
    suggested_skills: list[str] = []

    for section in sections:
        title = section.get("title", "").lower()
        items = section.get("items", [])
        polished: list[str] = []
        for item in items:
            line = _clean_text(item)
            if not line:
                continue
            if not line.endswith("."):
                line = f"{line}."
            polished.append(line)
        section["items"] = polished

        if title == "experience":
            improvements.append("Experience bullet points were polished for clearer impact.")
        elif title == "projects":
            improvements.append("Project descriptions were refined with professional wording.")

    if not improvements:
        improvements.append("Language was polished while preserving your original meaning.")

    return {
        "name": _clean_text(cv_data.get("name")),
        "sections": sections,
        "improvements": improvements,
        "suggested_skills": suggested_skills,
    }


def improve_cv_agent(state: dict[str, Any]) -> dict[str, Any]:
    action_data = state.get("action_data") or {}
    cv_data = action_data.get("cv_data") or {}

    incoming = {
        "name": _clean_text(cv_data.get("name")),
        "sections": _apply_strict_order(_normalize_sections(cv_data.get("sections"))),
    }

    prompt = "\n".join(
        [
            "Improve the following CV in a professional ATS-friendly style.",
            "Rules:",
            "- Keep exactly this section order: About, Experience, Education, Projects, Skills, Languages, Contact.",
            "- Keep all original facts and do not remove user data.",
            "- Do not invent facts.",
            "- Use stronger action verbs and concise wording.",
            "- Improve text in-place within existing sections only.",
            "- For Skills, preserve existing skills and add only relevant missing skills.",
            "Return valid JSON matching the response schema.",
            "CV JSON:",
            json.dumps(incoming, ensure_ascii=False),
        ]
    )

    payload = generate_with_gemini(
        prompt,
        response_schema=IMPROVE_SCHEMA,
        system_instruction="Return only valid JSON matching the schema.",
    )

    if payload and isinstance(payload, dict):
        state["improved_cv"] = _normalize_payload(payload)
    else:
        state["improved_cv"] = _fallback_improve(incoming)

    return state
