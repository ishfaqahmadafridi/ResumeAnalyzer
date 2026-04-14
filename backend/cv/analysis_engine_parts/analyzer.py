from __future__ import annotations

import re
from collections import Counter

from .gemini_client import gemini_is_configured, generate_with_gemini
from .prompt_prep import (
    CV_ANALYSIS_RESPONSE_SCHEMA,
    ROLE_BENCHMARK_RESPONSE_SCHEMA,
    build_cv_recommendation_prompt,
    build_role_benchmark_prompt,
    build_selected_role_prompt,
)
from .runtime import get_runtime_flags
from .skill_utils import sanitize_skill_items
from .structured_parser import parse_structured_cv


GEMINI_SYSTEM_INSTRUCTION = (
    "Return valid JSON only. "
    "Always follow the provided response schema exactly. "
    "Do not omit required fields. "
    "For role analysis, do not leave missing_skills or recommended_skills empty unless the prompt explicitly allows it."
)


class ModelUnavailableError(RuntimeError):
    pass


def _as_string_list(value: object) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, str)]


def _as_int(value: object, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_structured_data(value: object, fallback_text: str) -> dict:
    fallback_structured = dict(parse_structured_cv(fallback_text))
    if not isinstance(value, dict):
        value = fallback_structured

    return {
        "name": str(value.get("name", "")),
        "email": str(value.get("email", "")),
        "phone": str(value.get("phone", "")),
        "summary": str(value.get("summary", "")),
        "experience": _as_string_list(value.get("experience")),
        "education": _as_string_list(value.get("education")),
        "projects": _as_string_list(value.get("projects")),
        "skills": sanitize_skill_items(_as_string_list(value.get("skills"))),
        "languages": _as_string_list(value.get("languages")),
        "links": _as_string_list(value.get("links")),
    }


def _normalize_phrase(value: str) -> str:
    return re.sub(r"[^a-z0-9+.# ]+", " ", (value or "").lower()).strip()


def _clean_role_gap_items(items: list[str]) -> list[str]:
    blocked = {"english", "urdu", "pashto", "fuuast", "kohat", "islamabad", "london", "barcelona", "university", "college"}
    cleaned: list[str] = []
    seen: set[str] = set()
    for item in items:
        value = _normalize_phrase(str(item))
        if not value or len(value.split()) > 6:
            continue
        if any(token in value for token in blocked):
            continue
        if value in seen:
            continue
        seen.add(value)
        cleaned.append(value)
    return cleaned[:8]


def _empty_result(text: str, selected_role: str | None = None) -> dict:
    structured = _normalize_structured_data(None, text)
    if selected_role:
        return {
            "structured_data": structured,
            "recommended_roles": [],
            "analysis": {
                "role": selected_role,
                "your_skills": structured.get("skills", []),
                "matched_skills": [],
                "matched_skills_percentage": 0,
                "missing_skills": [],
                "recommended_skills": [],
                "role_specific_cv_score": 0,
            },
            "score": 0,
        }

    return {
        "structured_data": structured,
        "recommended_roles": [],
        "analysis": None,
        "score": 0,
    }


def _normalize_recommended_roles(value: object) -> list[dict]:
    roles: list[dict] = []
    if not isinstance(value, list):
        return roles

    for item in value:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        if not isinstance(role, str) or not role.strip():
            continue
        roles.append(
            {
                "role": role.strip(),
                "matched_skills": sanitize_skill_items(_as_string_list(item.get("matched_skills"))),
                "missing_skills": _clean_role_gap_items(_as_string_list(item.get("missing_skills"))),
                "matched_skills_percentage": _as_int(item.get("matched_skills_percentage"), 0),
            }
        )

    return roles[:3]


ROLE_CUE_RE = re.compile(
    r"(?i)\b(role|position|title|objective|seeking|applying for|target role)\b\s*[:\-]?\s*(.+)$"
)
ROLE_HEADLINE_RE = re.compile(
    r"(?i)^\s*([a-z][a-z0-9/&+\-\s]{2,70}?)\s+(with|experienced in|experience in|specializing in|focused on)\b"
)


def _normalize_role_title(value: str) -> str:
    return " ".join(token.capitalize() for token in value.strip().split())


def _extract_role_candidates(text_blob: str) -> list[str]:
    candidates: list[str] = []
    lines = [line.strip() for line in text_blob.splitlines() if line.strip()]

    for line in lines:
        cue_match = ROLE_CUE_RE.search(line)
        if cue_match:
            role_text = cue_match.group(2)
            role_text = re.split(r"[|,;/]", role_text)[0].strip()
            role_text = re.sub(r"\s+", " ", role_text)
            if 2 <= len(role_text.split()) <= 6:
                candidates.append(role_text.lower())

        at_split = re.split(r"\bat\b", line, maxsplit=1, flags=re.IGNORECASE)
        if len(at_split) == 2:
            maybe_role = re.sub(r"\s+", " ", at_split[0]).strip(" -:")
            if 2 <= len(maybe_role.split()) <= 6 and len(maybe_role) >= 5:
                candidates.append(maybe_role.lower())

        headline_match = ROLE_HEADLINE_RE.search(line)
        if headline_match:
            maybe_role = re.sub(r"\s+", " ", headline_match.group(1)).strip(" -:")
            if 2 <= len(maybe_role.split()) <= 6 and len(maybe_role) >= 5:
                candidates.append(maybe_role.lower())

    return candidates


def _build_recommended_roles_from_structured(structured: dict, raw_text: str = "") -> list[dict]:
    text_blob = "\n".join(
        [
            raw_text,
            str(structured.get("summary", "")),
            "\n".join(item for item in structured.get("experience", []) if isinstance(item, str)),
            "\n".join(item for item in structured.get("projects", []) if isinstance(item, str)),
            "\n".join(item for item in structured.get("education", []) if isinstance(item, str)),
        ]
    )

    matches = _extract_role_candidates(text_blob)
    if not matches:
        return []

    counts = Counter(matches)
    known_skills = _as_string_list(structured.get("skills"))
    top = counts.most_common(3)
    total = max(1, top[0][1])

    recommendations: list[dict] = []
    for idx, (role, count) in enumerate(top):
        ratio = count / total
        score = max(20, min(95, int(round(ratio * 100)) - idx * 10))
        recommendations.append(
            {
                "role": _normalize_role_title(role),
                "matched_skills": known_skills[:5],
                "missing_skills": [],
                "matched_skills_percentage": score,
            }
        )
    return recommendations


def _minimal_selected_role_analysis(structured: dict, selected_role: str) -> dict:
    your_skills = sanitize_skill_items(_as_string_list(structured.get("skills")))
    return {
        "role": selected_role,
        "your_skills": your_skills,
        "matched_skills": [],
        "matched_skills_percentage": 0,
        "missing_skills": [],
        "recommended_skills": [],
        "role_specific_cv_score": 0,
    }


def _normalize_analysis_payload(payload: dict, fallback_text: str, selected_role: str | None = None) -> dict | None:
    structured = _normalize_structured_data(payload.get("structured_data"), fallback_text)
    analysis = payload.get("analysis")
    recommended_roles = _normalize_recommended_roles(payload.get("recommended_roles"))

    if not selected_role:
        return {
            "structured_data": structured,
            "recommended_roles": recommended_roles,
            "analysis": None,
            "score": _as_int(payload.get("score"), 0),
        }

    if analysis is None:
        analysis = _minimal_selected_role_analysis(structured, selected_role)

    if not isinstance(analysis, dict):
        return None

    return {
        "structured_data": structured,
        "recommended_roles": recommended_roles,
        "analysis": {
            "role": selected_role,
            "your_skills": sanitize_skill_items(_as_string_list(analysis.get("your_skills", structured.get("skills", [])))),
            "matched_skills": sanitize_skill_items(_as_string_list(analysis.get("matched_skills"))),
            "matched_skills_percentage": _as_int(analysis.get("matched_skills_percentage"), 0),
            "missing_skills": _clean_role_gap_items(_as_string_list(analysis.get("missing_skills"))),
            "recommended_skills": _clean_role_gap_items(_as_string_list(analysis.get("recommended_skills"))),
            "role_specific_cv_score": _as_int(analysis.get("role_specific_cv_score", payload.get("score")), 0),
        },
        "score": _as_int(payload.get("score", analysis.get("role_specific_cv_score")), 0),
    }


def _normalize_role_benchmark_payload(payload: dict, selected_role: str) -> dict | None:
    role = payload.get("role")
    if not isinstance(role, str) or not role.strip():
        role = selected_role

    benchmark_skills = _clean_role_gap_items(_as_string_list(payload.get("benchmark_skills")))
    missing_skills = _clean_role_gap_items(_as_string_list(payload.get("missing_skills")))
    recommended_skills = _clean_role_gap_items(_as_string_list(payload.get("recommended_skills")))

    if not missing_skills and benchmark_skills:
        missing_skills = benchmark_skills
    if not recommended_skills and missing_skills:
        recommended_skills = missing_skills[:5]

    return {
        "role": role,
        "matched_skills": sanitize_skill_items(_as_string_list(payload.get("matched_skills"))),
        "matched_skills_percentage": _as_int(payload.get("matched_skills_percentage"), 0),
        "missing_skills": missing_skills,
        "recommended_skills": recommended_skills,
        "role_specific_cv_score": _as_int(payload.get("role_specific_cv_score", payload.get("matched_skills_percentage")), 0),
    }


def _enrich_selected_role_with_gemini(text: str, selected_role: str, current_result: dict, flags: dict) -> dict:
    prompt = build_role_benchmark_prompt(text, selected_role, int(flags["max_prompt_chars"]))
    payload = generate_with_gemini(
        prompt,
        model=str(flags["model"]),
        response_schema=ROLE_BENCHMARK_RESPONSE_SCHEMA,
        system_instruction=GEMINI_SYSTEM_INSTRUCTION,
    )
    if not payload:
        return current_result

    benchmark = _normalize_role_benchmark_payload(payload, selected_role)
    if not benchmark:
        return current_result

    analysis = current_result.get("analysis") or {}
    current_result["analysis"] = {
        "role": selected_role,
        "your_skills": analysis.get("your_skills", []),
        "matched_skills": benchmark["matched_skills"] or analysis.get("matched_skills", []),
        "matched_skills_percentage": benchmark["matched_skills_percentage"],
        "missing_skills": benchmark["missing_skills"],
        "recommended_skills": benchmark["recommended_skills"],
        "role_specific_cv_score": benchmark["role_specific_cv_score"],
    }
    current_result["score"] = benchmark["role_specific_cv_score"]
    return current_result


def analyze_cv_text(text: str, selected_role: str | None = None) -> dict:
    structured_fallback = _normalize_structured_data(None, text)
    flags = get_runtime_flags()

    strict_role_model_required = bool(flags.get("role_analysis_model_required", False))
    gemini_enabled = bool(flags.get("use_llm") and flags.get("provider") == "gemini" and gemini_is_configured())

    if selected_role and strict_role_model_required and not gemini_enabled:
        raise ModelUnavailableError("Role analysis model is unavailable. Please check Gemini configuration.")

    if gemini_enabled:
        prompt = (
            build_selected_role_prompt(text, selected_role, int(flags["max_prompt_chars"]))
            if selected_role
            else build_cv_recommendation_prompt(text, int(flags["max_prompt_chars"]))
        )
        llm_payload = generate_with_gemini(
            prompt,
            model=str(flags["model"]),
            response_schema=CV_ANALYSIS_RESPONSE_SCHEMA,
            system_instruction=GEMINI_SYSTEM_INSTRUCTION,
        )
        if llm_payload:
            normalized = _normalize_analysis_payload(llm_payload, text, selected_role=selected_role)
            if normalized:
                if selected_role:
                    normalized = _enrich_selected_role_with_gemini(text, selected_role, normalized, flags)
                    enriched_analysis = normalized.get("analysis") or {}
                    if strict_role_model_required and (
                        not enriched_analysis.get("missing_skills") or not enriched_analysis.get("recommended_skills")
                    ):
                        raise ModelUnavailableError("Role analysis model returned incomplete benchmark guidance.")

                    normalized["analysis"] = {
                        "role": selected_role,
                        "your_skills": sanitize_skill_items(_as_string_list(enriched_analysis.get("your_skills", structured_fallback.get("skills", [])))),
                        "matched_skills": sanitize_skill_items(_as_string_list(enriched_analysis.get("matched_skills"))),
                        "matched_skills_percentage": _as_int(enriched_analysis.get("matched_skills_percentage"), 0),
                        "missing_skills": _clean_role_gap_items(_as_string_list(enriched_analysis.get("missing_skills"))),
                        "recommended_skills": _clean_role_gap_items(_as_string_list(enriched_analysis.get("recommended_skills"))),
                        "role_specific_cv_score": _as_int(enriched_analysis.get("role_specific_cv_score"), 0),
                    }
                    normalized["score"] = _as_int(normalized["analysis"].get("role_specific_cv_score"), 0)
                return normalized

        if selected_role:
            if strict_role_model_required:
                raise ModelUnavailableError("Role analysis model is unavailable. Please try again shortly.")

            return {
                "structured_data": structured_fallback,
                "recommended_roles": _build_recommended_roles_from_structured(structured_fallback, raw_text=text),
                "analysis": _minimal_selected_role_analysis(structured_fallback, selected_role),
                "score": 0,
            }

    structured = structured_fallback
    recommended_roles = _build_recommended_roles_from_structured(structured, raw_text=text)

    if selected_role:
        if strict_role_model_required:
            raise ModelUnavailableError("Role analysis model is required but unavailable.")

        analysis = _minimal_selected_role_analysis(structured, selected_role)
        return {
            "structured_data": structured,
            "recommended_roles": recommended_roles,
            "analysis": analysis,
            "score": _as_int(analysis.get("role_specific_cv_score"), 0),
        }

    return {
        "structured_data": structured,
        "recommended_roles": recommended_roles,
        "analysis": None,
        "score": _as_int(recommended_roles[0]["matched_skills_percentage"], 0) if recommended_roles else 0,
    }
