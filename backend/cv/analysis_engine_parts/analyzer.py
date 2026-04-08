from __future__ import annotations

from .role_processing import rank_roles
from .structured_parser import parse_structured_cv


def analyze_cv_text(text: str, selected_role: str | None = None) -> dict:
    structured = parse_structured_cv(text)
    ranked_roles = rank_roles(structured.get("skills", []))
    primary = next((role for role in ranked_roles if role["role"] == selected_role), ranked_roles[0] if ranked_roles else None)

    if primary is None:
        return {
            "structured_data": structured,
            "recommended_roles": [],
            "analysis": None,
            "score": 0,
        }

    return {
        "structured_data": structured,
        "recommended_roles": ranked_roles[:3],
        "analysis": {
            "role": primary["role"],
            "your_skills": structured.get("skills", []),
            "matched_skills": primary["matched_skills"],
            "matched_skills_percentage": primary["matched_skills_percentage"],
            "missing_skills": primary["missing_skills"],
            "recommended_skills": primary["missing_skills"][:5],
            "role_specific_cv_score": max(20, primary["matched_skills_percentage"]),
        },
        "score": max(20, primary["matched_skills_percentage"]),
    }
