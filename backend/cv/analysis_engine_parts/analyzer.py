from __future__ import annotations

from .gemini_client import gemini_is_configured, generate_with_gemini
from .prompt_prep import (
    CV_ANALYSIS_RESPONSE_SCHEMA,
    ROLE_BENCHMARK_RESPONSE_SCHEMA,
    build_cv_recommendation_prompt,
    build_role_benchmark_prompt,
    build_selected_role_prompt,
)
from .runtime import get_runtime_flags
from .structured_parser import parse_structured_cv


GEMINI_SYSTEM_INSTRUCTION = (
    "Return valid JSON only. "
    "Always follow the provided response schema exactly. "
    "Do not omit required fields. "
    "For role analysis, do not leave missing_skills or recommended_skills empty unless the prompt explicitly allows it."
)


def _empty_result(text: str, selected_role: str | None = None) -> dict:
    structured = dict(parse_structured_cv(text))
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
                "matched_skills": [skill for skill in item.get("matched_skills", []) if isinstance(skill, str)],
                "missing_skills": [skill for skill in item.get("missing_skills", []) if isinstance(skill, str)],
                "matched_skills_percentage": int(item.get("matched_skills_percentage", 0)),
            }
        )

    return roles[:3]


def _normalize_analysis_payload(payload: dict, fallback_text: str, selected_role: str | None = None) -> dict | None:
    structured = payload.get("structured_data")
    analysis = payload.get("analysis")
    recommended_roles = _normalize_recommended_roles(payload.get("recommended_roles"))
    fallback_structured = dict(parse_structured_cv(fallback_text))

    if not isinstance(structured, dict):
        structured = fallback_structured
    else:
        structured = {
            "name": str(structured.get("name", "")),
            "email": str(structured.get("email", "")),
            "phone": str(structured.get("phone", "")),
            "summary": str(structured.get("summary", "")),
            "experience": [item for item in structured.get("experience", []) if isinstance(item, str)],
            "education": [item for item in structured.get("education", []) if isinstance(item, str)],
            "projects": [item for item in structured.get("projects", []) if isinstance(item, str)],
            "skills": [item for item in structured.get("skills", []) if isinstance(item, str)],
            "links": [item for item in structured.get("links", []) if isinstance(item, str)],
        }

    if analysis is None:
        if selected_role:
            analysis = {
                "role": selected_role,
                "your_skills": structured.get("skills", []),
                "matched_skills": [],
                "matched_skills_percentage": 0,
                "missing_skills": [],
                "recommended_skills": [],
                "role_specific_cv_score": 0,
            }
        else:
            return {
                "structured_data": structured,
                "recommended_roles": recommended_roles,
                "analysis": None,
                "score": 0,
            }

    if not isinstance(analysis, dict):
        return None

    role = selected_role or analysis.get("role")
    if not isinstance(role, str) or not role.strip():
        role = ""

    return {
        "structured_data": structured,
        "recommended_roles": recommended_roles,
        "analysis": {
            "role": role,
            "your_skills": [item for item in analysis.get("your_skills", structured.get("skills", [])) if isinstance(item, str)],
            "matched_skills": [item for item in analysis.get("matched_skills", []) if isinstance(item, str)],
            "matched_skills_percentage": int(analysis.get("matched_skills_percentage", 0)),
            "missing_skills": [item for item in analysis.get("missing_skills", []) if isinstance(item, str)],
            "recommended_skills": [item for item in analysis.get("recommended_skills", []) if isinstance(item, str)],
            "role_specific_cv_score": int(analysis.get("role_specific_cv_score", payload.get("score", 0))),
        },
        "score": int(payload.get("score", analysis.get("role_specific_cv_score", 0))),
    }


def _normalize_role_benchmark_payload(payload: dict, selected_role: str) -> dict | None:
    role = payload.get("role")
    if not isinstance(role, str) or not role.strip():
        role = selected_role

    benchmark_skills = [item for item in payload.get("benchmark_skills", []) if isinstance(item, str)]
    missing_skills = [item for item in payload.get("missing_skills", []) if isinstance(item, str)]
    recommended_skills = [item for item in payload.get("recommended_skills", []) if isinstance(item, str)]

    if not missing_skills and benchmark_skills:
        missing_skills = benchmark_skills
    if not recommended_skills and missing_skills:
        recommended_skills = missing_skills[:5]

    return {
        "role": role,
        "matched_skills": [item for item in payload.get("matched_skills", []) if isinstance(item, str)],
        "matched_skills_percentage": int(payload.get("matched_skills_percentage", 0)),
        "missing_skills": missing_skills,
        "recommended_skills": recommended_skills,
        "role_specific_cv_score": int(payload.get("role_specific_cv_score", payload.get("matched_skills_percentage", 0))),
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
    flags = get_runtime_flags()
    if flags.get("use_llm") and flags.get("provider") == "gemini" and gemini_is_configured():
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
                analysis = normalized.get("analysis") or {}
                if selected_role and not analysis.get("missing_skills") and not analysis.get("recommended_skills"):
                    return _enrich_selected_role_with_gemini(text, selected_role, normalized, flags)
                return normalized

        if selected_role:
            return _enrich_selected_role_with_gemini(text, selected_role, _empty_result(text, selected_role), flags)

    return _empty_result(text, selected_role)
