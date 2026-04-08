from __future__ import annotations

import re

from cv.constants import KNOWN_SKILLS


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def extract_known_skills(text: str) -> list[str]:
    haystack = normalize_text(text)
    matched = [skill for skill in KNOWN_SKILLS if skill in haystack]
    return sorted(set(matched))
