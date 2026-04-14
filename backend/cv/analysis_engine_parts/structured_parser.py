from __future__ import annotations

import re

from .schemas import StructuredCV
from .skill_utils import extract_known_skills

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_RE = re.compile(r"(\+?\d[\d\s\-()]{7,}\d)")
LINK_RE = re.compile(r"https?://\S+|www\.\S+")
SECTION_RE = re.compile(
    r"(?im)^(summary|experience|work experience|education|projects|skills|languages|certifications)\s*:?\s*$"
)


def _extract_languages(text: str, sections: dict[str, list[str]]) -> list[str]:
    spoken_languages = {
        "english",
        "urdu",
        "pashto",
        "arabic",
        "hindi",
        "french",
        "german",
        "spanish",
        "chinese",
        "turkish",
        "romanian",
    }

    candidates: list[str] = []

    for line in sections.get("languages", []):
        parts = re.split(r"[,|;/•]", line)
        candidates.extend(part.strip().lower() for part in parts if part.strip())

    for raw in text.splitlines():
        line = raw.strip().lower()
        if not line.startswith("languages"):
            continue
        content = line.split(":", 1)[1] if ":" in line else line.replace("languages", "")
        parts = re.split(r"[,|;/•]", content)
        candidates.extend(part.strip() for part in parts if part.strip())

    cleaned: list[str] = []
    seen: set[str] = set()
    for value in candidates:
        base = re.sub(r"\s*\([^)]*\)", "", value).strip()
        first = base.split()[0] if base.split() else ""
        if first not in spoken_languages:
            continue
        normalized = first
        if normalized in seen:
            continue
        seen.add(normalized)
        cleaned.append(normalized)

    return cleaned


def _first_nonempty_line(text: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped[:120]
    return ""


def _split_sections(text: str) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {}
    current = "general"
    sections[current] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = SECTION_RE.match(line)
        if match:
            current = match.group(1).lower()
            sections.setdefault(current, [])
            continue
        sections.setdefault(current, []).append(line)
    return sections


def parse_structured_cv(text: str) -> StructuredCV:
    sections = _split_sections(text)
    return StructuredCV(
        name=_first_nonempty_line(text),
        email=(EMAIL_RE.search(text).group(0) if EMAIL_RE.search(text) else ""),
        phone=(PHONE_RE.search(text).group(0) if PHONE_RE.search(text) else ""),
        summary=" ".join(sections.get("summary", [])[:3]),
        experience=sections.get("experience", []) or sections.get("work experience", []),
        education=sections.get("education", []),
        projects=sections.get("projects", []),
        skills=extract_known_skills(text),
        languages=_extract_languages(text, sections),
        links=LINK_RE.findall(text),
    )
