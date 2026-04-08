from __future__ import annotations

from cv.domain_catalog import get_role_catalog


def rank_roles(skills: list[str]) -> list[dict]:
    candidate_roles = []
    skill_set = set(skills)
    for role, expected_skills in get_role_catalog().items():
        matched = sorted(skill_set.intersection(expected_skills))
        percentage = int((len(matched) / max(len(expected_skills), 1)) * 100)
        candidate_roles.append(
            {
                "role": role,
                "matched_skills": matched,
                "missing_skills": sorted(expected_skills.difference(skill_set)),
                "matched_skills_percentage": percentage,
            }
        )
    return sorted(candidate_roles, key=lambda item: item["matched_skills_percentage"], reverse=True)
