from __future__ import annotations

from typing import TypedDict


class StructuredCV(TypedDict, total=False):
    name: str
    email: str
    phone: str
    summary: str
    experience: list[str]
    education: list[str]
    projects: list[str]
    skills: list[str]
    links: list[str]


class RoleAnalysis(TypedDict):
    role: str
    matched_skills: list[str]
    missing_skills: list[str]
    recommended_skills: list[str]
    matched_skills_percentage: int
    score: int
