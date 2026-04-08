from __future__ import annotations

from .schemas import StructuredCV


def build_interview_context(structured_cv: StructuredCV, role: str) -> str:
    return (
        f"Role: {role}\n"
        f"Candidate: {structured_cv.get('name', '')}\n"
        f"Skills: {', '.join(structured_cv.get('skills', []))}\n"
        f"Summary: {structured_cv.get('summary', '')}"
    )
