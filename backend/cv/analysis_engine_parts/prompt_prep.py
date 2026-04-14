from __future__ import annotations

from .schemas import StructuredCV


SKILL_HYGIENE_RULES = """- In structured_data.skills include only professional or technical competencies.
- Never include person names, contact details, links, locations, spoken languages, date ranges, or sentence fragments in skills.
- Never include separators or formatting artifacts as skills (for example lines like \"_____\", bullets, or punctuation-only strings).
- Avoid generic fillers as skills (for example \"web\", \"development\", \"developer\", \"with\", \"present\")."""


CV_ANALYSIS_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "structured_data": {
            "type": "OBJECT",
            "properties": {
                "name": {"type": "STRING"},
                "email": {"type": "STRING"},
                "phone": {"type": "STRING"},
                "summary": {"type": "STRING"},
                "experience": {"type": "ARRAY", "items": {"type": "STRING"}},
                "education": {"type": "ARRAY", "items": {"type": "STRING"}},
                "projects": {"type": "ARRAY", "items": {"type": "STRING"}},
                "skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "languages": {"type": "ARRAY", "items": {"type": "STRING"}},
                "links": {"type": "ARRAY", "items": {"type": "STRING"}},
            },
            "required": ["name", "email", "phone", "summary", "experience", "education", "projects", "skills", "languages", "links"],
        },
        "recommended_roles": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "role": {"type": "STRING"},
                    "matched_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "missing_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "matched_skills_percentage": {"type": "NUMBER"},
                },
                "required": ["role", "matched_skills", "missing_skills", "matched_skills_percentage"],
            },
        },
        "analysis": {
            "type": "OBJECT",
            "properties": {
                "role": {"type": "STRING"},
                "your_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "matched_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "matched_skills_percentage": {"type": "NUMBER"},
                "missing_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "recommended_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
                "role_specific_cv_score": {"type": "NUMBER"},
            },
            "required": [
                "role",
                "your_skills",
                "matched_skills",
                "matched_skills_percentage",
                "missing_skills",
                "recommended_skills",
                "role_specific_cv_score",
            ],
        },
        "score": {"type": "NUMBER"},
    },
    "required": ["structured_data", "recommended_roles", "analysis", "score"],
}


ROLE_BENCHMARK_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "role": {"type": "STRING"},
        "benchmark_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
        "matched_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
        "missing_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
        "recommended_skills": {"type": "ARRAY", "items": {"type": "STRING"}},
        "matched_skills_percentage": {"type": "NUMBER"},
        "role_specific_cv_score": {"type": "NUMBER"},
    },
    "required": [
        "role",
        "benchmark_skills",
        "matched_skills",
        "missing_skills",
        "recommended_skills",
        "matched_skills_percentage",
        "role_specific_cv_score",
    ],
}


def build_interview_context(structured_cv: StructuredCV, role: str) -> str:
    return (
        f"Role: {role}\n"
        f"Candidate: {structured_cv.get('name', '')}\n"
        f"Skills: {', '.join(structured_cv.get('skills', []))}\n"
        f"Summary: {structured_cv.get('summary', '')}"
    )


def build_cv_recommendation_prompt(cv_text: str, max_prompt_chars: int) -> str:
    trimmed_text = cv_text[:max_prompt_chars]
    return f"""You are an expert CV reviewer and job-role classifier.

Your task:
1. Read the extracted CV text.
2. Decide which professional field this CV belongs to.
3. Recommend the best roles this candidate should apply for based on the actual CV field.
4. Return structured CV details and a short role-fit analysis for the best recommended role.

Rules:
- Recommend exactly 3 roles, ordered best to worst.
- Use role names that genuinely match the candidate's field, for example HR Recruiter, Talent Acquisition Specialist, Mechanical Engineer, Civil Engineer, Frontend Developer, Data Analyst, AI Engineer, etc.
- Do not force software or data roles if the CV belongs to another field.
- Prioritize evidence in this order:
  1. CV headline or title
  2. recent work experience and job titles
  3. education and degree domain
  4. repeated responsibilities and domain keywords
  5. tools and software mentioned
- A single generic tool like Excel must not override stronger evidence such as "Human Resources", "Recruiter", or "Industrial Psychology".
- If the CV title or work history indicates HR, recruiting, people operations, talent acquisition, or industrial psychology, recommend HR-related roles first.
- If the CV title, work history, or education indicates Mechanical Engineer, CAD Operator, manufacturing, welding, AutoCAD, SolidWorks, ANSYS, or mechanical engineering, recommend Mechanical Engineer and closely related engineering roles first.
- For engineering CVs, do not return an empty recommended_roles list if the field is clearly visible from the CV title, work history, or degree.
- Keep matched_skills, missing_skills, and recommended_skills concise and relevant.
- matched_skills_percentage and score must be integers from 0 to 100.
- role_specific_cv_score must be an integer from 0 to 100.
- If a detail is not available, return an empty string or empty array.
- Do not return an empty recommended_roles list unless the CV text is genuinely unreadable.
{SKILL_HYGIENE_RULES}
- Return JSON only. Do not add markdown fences or commentary.

Required JSON shape:
{{
  "structured_data": {{
    "name": "string",
    "email": "string",
    "phone": "string",
    "summary": "string",
    "experience": ["string"],
    "education": ["string"],
    "projects": ["string"],
    "skills": ["string"],
    "links": ["string"]
  }},
  "recommended_roles": [
    {{
      "role": "Frontend Developer",
      "matched_skills": ["react"],
      "missing_skills": ["typescript"],
      "matched_skills_percentage": 50
    }}
  ],
  "analysis": {{
    "role": "Frontend Developer",
    "your_skills": ["react"],
    "matched_skills": ["react"],
    "matched_skills_percentage": 50,
    "missing_skills": ["typescript"],
    "recommended_skills": ["typescript"],
    "role_specific_cv_score": 50
  }},
  "score": 50
}}

Extracted CV text:
\"\"\"
{trimmed_text}
\"\"\""""


def build_selected_role_prompt(cv_text: str, selected_role: str, max_prompt_chars: int) -> str:
    trimmed_text = cv_text[:max_prompt_chars]
    return f"""You are an expert CV reviewer.

Your task:
1. Read the extracted CV text.
2. Analyze the CV specifically for the selected role: {selected_role}.
3. Return updated structured CV details, top 3 recommended roles, and a focused analysis for the selected role.

Rules:
- The analysis.role value must exactly match the selected role: {selected_role}.
- Recommend exactly 3 roles, ordered best to worst.
- Keep the recommended roles aligned with the candidate's real field instead of forcing unrelated software roles.
- matched_skills, missing_skills, and recommended_skills must be specific and concise.
- If the selected role is broad or short, such as "HR", interpret it using standard professional meaning, for example "Human Resources".
- Even if the CV has weak skill extraction, infer the benchmark skills for the selected role from professional knowledge.
- If the selected role is clearly technical or domain-specific, such as Mechanical Engineer, infer benchmark skills from the role even when the parsed skills list is empty.
- For a selected role analysis, missing_skills and recommended_skills must not be empty. Return the most important role-related skills that the candidate should develop next.
- matched_skills can be empty, but missing_skills and recommended_skills should still be populated from the selected role benchmark.
- missing_skills and recommended_skills must each contain at least 3 concise role-related items.
{SKILL_HYGIENE_RULES}
- matched_skills_percentage and score must be integers from 0 to 100.
- role_specific_cv_score must be an integer from 0 to 100.
- Return JSON only. Do not add markdown fences or commentary.

Required JSON shape:
{{
  "structured_data": {{
    "name": "string",
    "email": "string",
    "phone": "string",
    "summary": "string",
    "experience": ["string"],
    "education": ["string"],
    "projects": ["string"],
    "skills": ["string"],
    "links": ["string"]
  }},
  "recommended_roles": [
    {{
      "role": "Frontend Developer",
      "matched_skills": ["react"],
      "missing_skills": ["typescript"],
      "matched_skills_percentage": 50
    }}
  ],
  "analysis": {{
    "role": "{selected_role}",
    "your_skills": ["react"],
    "matched_skills": ["react"],
    "matched_skills_percentage": 50,
    "missing_skills": ["typescript"],
    "recommended_skills": ["typescript"],
    "role_specific_cv_score": 50
  }},
  "score": 50
}}

Extracted CV text:
\"\"\"
{trimmed_text}
\"\"\""""


def build_role_benchmark_prompt(cv_text: str, selected_role: str, max_prompt_chars: int) -> str:
    trimmed_text = cv_text[:max_prompt_chars]
    return f"""You are an expert recruiter and role-skills analyst.

Your task:
1. Read the extracted CV text.
2. Use the selected target role: {selected_role}.
3. Infer the important benchmark skills for that target role, even if the CV itself is weak or incomplete.
4. Compare the CV against that target role and return matched skills, missing skills, and recommended next skills.

Rules:
- The role must stay exactly: {selected_role}.
- Do not change the role to another title.
- If the CV is weak, still provide realistic missing_skills and recommended_skills for the selected role.
- Use the CV title, work history, education, and domain language to interpret the selected role in context.
- For example:
  - HR -> employee relations, recruitment, onboarding, hr policies, talent acquisition
  - Mechanical Engineer -> CAD, SolidWorks, AutoCAD, manufacturing, design validation
  - QA -> test cases, bug tracking, regression testing, quality assurance, test planning
- If the CV already shows a field clearly, such as Mechanical Engineer in the title or experience, use that as strong evidence for benchmark skill selection.
- Keep all skill items short, practical, and role-specific.
- missing_skills and recommended_skills must not be empty.
- Return JSON only. Do not add markdown fences or commentary.

Required JSON shape:
{{
  "role": "{selected_role}",
  "benchmark_skills": ["employee relations", "recruitment", "hr policies"],
  "matched_skills": ["excel"],
  "missing_skills": ["employee relations", "recruitment", "hr policies"],
  "recommended_skills": ["employee relations", "recruitment", "hr policies"],
  "matched_skills_percentage": 10,
  "role_specific_cv_score": 10
}}

Extracted CV text:
\"\"\"
{trimmed_text}
\"\"\""""
