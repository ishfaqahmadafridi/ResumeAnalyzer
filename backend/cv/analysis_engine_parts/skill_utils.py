from __future__ import annotations

import re


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def sanitize_skill_items(items: list[str]) -> list[str]:
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
    blocked_fragments = {
        "university",
        "college",
        "school",
        "bachelor",
        "master",
        "degree",
        "education",
        "intermediate",
        "matric",
        "campus",
        "islamabad",
        "lahore",
        "karachi",
        "rawalpindi",
        "kpk",
        "punjab",
        "contact",
        "address",
        "linkedin",
        "github",
        "gmail",
        "hotmail",
        "outlook",
        "yahoo",
        "united kingdom",
        "unitedkingdom",
        "barcelona",
        "london",
        "united states",
        "georgia",
        "market",
        "sectors",
        "growth",
        "quarter",
        "yoy",
        "fuuast",
        "kohat",
        " kp ",
        "ics",
        "hssc",
        "ssc",
        "metric",
        "matriculation",
    }
    filler_words = {
        "that",
        "with",
        "and",
        "for",
        "to",
        "of",
        "the",
        "present",
        "supervised",
        "worded",
        "styled",
        "employees",
        "annual",
        "revenue",
        "continue",
        "first",
        "completed",
    }
    weak_single_tokens = {
        "web",
        "development",
        "developer",
        "developers",
        "stack",
        "stacks",
        "framework",
        "frameworks",
        "technology",
        "technologies",
        "frontend",
        "backend",
        "full",
        "basic",
        "science",
        "tools",
    }

    skill_keywords = {
        "python",
        "django",
        "fastapi",
        "flask",
        "react",
        "next",
        "next.js",
        "typescript",
        "javascript",
        "html",
        "css",
        "tailwind",
        "bootstrap",
        "jquery",
        "node",
        "node.js",
        "sql",
        "postgresql",
        "mysql",
        "mongodb",
        "redis",
        "docker",
        "kubernetes",
        "git",
        "figma",
        "rest",
        "api",
        "restful",
        "version control",
        "version control systems",
        "web development stacks",
        "spring",
        "spring boot",
        "laravel",
        "firebase",
        "autocad",
        "solidworks",
        "catia",
        "ansys",
        "abaqus",
        "fea",
        "finite element",
        "blueprint",
        "technical drawing",
        "machine design",
        "material selection",
        "manufacturing",
        "casting",
        "machining",
        "welding",
        "thermodynamics",
        "matlab",
        "simulink",
        "cad",
        "cam",
        "technical drawing",
        "blueprint reading",
        "machine design",
        "material selection",
        "finite element analysis",
        "employee relations",
        "recruitment",
        "hr policies",
        "talent acquisition",
        "onboarding",
    }

    month_tokens = {"jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"}

    joined_phrase_map = {
        "technicaldrawing": "technical drawing",
        "blueprintreading": "blueprint reading",
        "machinedesign": "machine design",
        "materialselection": "material selection",
        "finiteelementanalysis": "finite element analysis",
        "frontendweb": "frontend web",
        "backenddevelopers": "backend developers",
    }

    def looks_like_skill(value: str) -> bool:
        if not value:
            return False
        if any(keyword in value for keyword in skill_keywords):
            return True
        # Keep concise acronyms/tech-like tokens.
        if re.fullmatch(r"[a-z]{2,12}\d{0,2}", value):
            return True
        return False
    cleaned: list[str] = []
    seen: set[str] = set()
    for item in items:
        value = normalize_text(item)
        if value.startswith("skills "):
            value = value.replace("skills ", "", 1).strip()
        for joined, expanded in joined_phrase_map.items():
            value = value.replace(joined, expanded)
        if len(value) < 2:
            continue
        if not re.search(r"[a-z]", value):
            continue
        if re.fullmatch(r"[_\-./\s]+", value):
            continue
        if any(fragment in f" {value} " for fragment in blocked_fragments):
            continue
        if "@" in value or "http" in value or "www." in value or ".com" in value:
            continue
        if re.search(r"\b\d{4,}\b", value):
            continue
        if re.search(r"\d+%", value):
            continue

        # Remove spoken language entries like "english", "english (native)", "spanish conversational".
        base = re.sub(r"\s*\([^)]*\)", "", value).strip()
        first = base.split()[0] if base.split() else ""
        if first in spoken_languages:
            continue

        tokens = value.split()
        if any(token in month_tokens for token in tokens):
            continue
        if any(len(token) > 20 for token in tokens):
            continue
        if len(tokens) == 1 and tokens[0] in filler_words:
            continue
        if len(tokens) == 1 and tokens[0] in weak_single_tokens:
            continue
        if len(tokens) > 4:
            continue
        if len(tokens) > 1 and any(token in filler_words for token in tokens):
            continue
        if len(tokens) > 1 and (tokens[0] in filler_words or tokens[-1] in filler_words):
            continue
        if not looks_like_skill(value):
            continue
        if value in seen:
            continue
        seen.add(value)
        cleaned.append(value)

    multi_word = [item for item in cleaned if " " in item]
    filtered: list[str] = []
    for item in cleaned:
        tokens = item.split()
        if len(tokens) == 1:
            # Drop single-token duplicates when a stronger multi-word phrase already includes it.
            if tokens[0] in weak_single_tokens and any(re.search(rf"\b{re.escape(item)}\b", phrase) for phrase in multi_word):
                continue
        filtered.append(item)

    return filtered[:30]


def extract_known_skills(text: str) -> list[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    lowered_lines = [line.lower() for line in lines]
    first_line = normalize_text(lines[0]) if lines else ""

    skill_like_headers = (
        "skills",
        "technical skills",
        "technologies",
        "tools",
        "tech stack",
    )
    boundary_headers = (
        "experience",
        "education",
        "projects",
        "summary",
        "certifications",
        "references",
        "contact",
    )

    # Prefer explicit Skills sections when present.
    candidates: list[str] = []
    for idx, line in enumerate(lowered_lines):
        if any(line.startswith(header) for header in skill_like_headers):
            for skill_line in lines[idx + 1 : idx + 20]:
                if any(skill_line.lower().startswith(header) for header in boundary_headers):
                    break
                parts = re.split(r"[,|;/•]", skill_line)
                for part in parts:
                    value = part.strip()
                    if not value:
                        continue
                    if ":" in value:
                        # Keep right-hand side for lines like "Technical skills: React, JS".
                        value = value.split(":", 1)[1].strip() or value
                    # If a skills-section item is a compact space-separated line with no delimiters,
                    # keep short phrases (2-3 words) as one skill, but split longer token lists (4+ words).
                    words = [token.strip() for token in re.split(r"\s+", value) if token.strip()]
                    if (
                        len(parts) == 1
                        and 2 <= len(words) <= 8
                        and all(re.fullmatch(r"[A-Za-z0-9+#./-]{2,25}", token) for token in words)
                    ):
                        if len(words) >= 4:
                            candidates.extend(words)
                        else:
                            candidates.append(" ".join(words))
                    else:
                        candidates.append(value)

    # Fallback: extract likely skill segments from relevant lines only.
    likely_lines: list[str] = []
    for line in lines:
        lowered = line.lower()
        if any(h in lowered for h in ("skills", "technolog", "tools", "stack", "proficient", "experienced with", "framework")):
            likely_lines.append(line)
        elif (
            "," in line
            and len(line.split()) <= 16
            and not any(token in lowered for token in ("internship", "university", "experience", "responsible", "developed", "worked", "project"))
        ):
            likely_lines.append(line)

    phrase_pattern = re.compile(r"\b[A-Za-z][A-Za-z0-9+#./-]{1,30}(?:\s+[A-Za-z][A-Za-z0-9+#./-]{1,30})?\b")
    fallback_blob = "\n".join(likely_lines)
    candidates.extend(match.group(0).strip() for match in phrase_pattern.finditer(fallback_blob))

    stopwords = {
        "curriculum vitae",
        "resume",
        "summary",
        "experience",
        "education",
        "project",
        "projects",
        "responsible",
        "worked",
        "company",
        "email",
        "phone",
        "address",
        "objective",
        "profile",
        "languages",
        "language",
        "technical skills",
        "technical",
        "skills",
        "contact",
        "linkedin",
        "github",
        "gmail",
        "hotmail",
        "outlook",
        "yahoo",
    }

    normalized_candidates = [re.sub(r"\s+", " ", item).strip().lower() for item in candidates]
    normalized_candidates = [item for item in normalized_candidates if item and item not in stopwords and item != first_line and not item.endswith(":")]
    return sanitize_skill_items(normalized_candidates)
