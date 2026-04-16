import type { CVRecord } from "@/types";
import type { CVDiff, CVEditorData, CVSection, CVSectionKey } from "@/features/cv/types/update";

const SECTION_TITLE_ALIASES: Record<string, { key: CVSectionKey; title: string }> = {
  about: { key: "about", title: "About" },
  summary: { key: "about", title: "About" },
  profile: { key: "about", title: "About" },
  experience: { key: "experience", title: "Experience" },
  "work experience": { key: "experience", title: "Experience" },
  education: { key: "education", title: "Education" },
  eduction: { key: "education", title: "Education" },
  academic: { key: "education", title: "Education" },
  academics: { key: "education", title: "Education" },
  qualification: { key: "education", title: "Education" },
  qualifications: { key: "education", title: "Education" },
  projects: { key: "projects", title: "Projects" },
  project: { key: "projects", title: "Projects" },
  skills: { key: "skills", title: "Skills" },
  "technical skills": { key: "skills", title: "Skills" },
  languages: { key: "languages", title: "Languages" },
  language: { key: "languages", title: "Languages" },
  certifications: { key: "certifications", title: "Certifications" },
  certificates: { key: "certifications", title: "Certifications" },
  contact: { key: "contact", title: "Contact" },
  "contact information": { key: "contact", title: "Contact" },
};

function makeSectionId(key: CVSectionKey, index: number): string {
  return `${key}-${index}`;
}

function normalizeHeading(raw: string): string {
  return raw.replace(/\s+/g, " ").replace(/:$/, "").trim();
}

function resolveSection(rawTitle: string): { key: CVSectionKey; title: string } {
  const normalized = normalizeHeading(rawTitle).toLowerCase();
  return SECTION_TITLE_ALIASES[normalized] || { key: "custom", title: normalizeHeading(rawTitle) || "Section" };
}

function isHeadingLine(line: string): boolean {
  const normalized = normalizeHeading(line);
  if (!normalized) {
    return false;
  }

  const lowered = normalized.toLowerCase();
  if (SECTION_TITLE_ALIASES[lowered]) {
    return true;
  }

  const words = normalized.split(/\s+/);
  if (words.length > 4) {
    return false;
  }

  return /^[A-Z][A-Z\s&/()-]+$/.test(normalized);
}

function splitLines(value: string): string[] {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitLooseList(value: string): string[] {
  return value
    .split(/\s{2,}|\|/)
    .flatMap((part) => part.split(/,(?=\s*[A-Za-z])/))
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLanguages(value: string): string[] {
  const base = splitLooseList(value);

  // If user types "English Urdu Pashto" in one line, split into separate languages.
  const expanded = base.flatMap((item) => {
    if (item.includes("|") || item.includes(",")) {
      return item
        .split(/[|,]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    }

    if (/^[A-Za-z\s]+$/.test(item) && item.split(/\s+/).length > 1) {
      return item
        .split(/\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
    }

    return [item.trim()];
  });

  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const lang of expanded) {
    const cleaned = lang.trim();
    if (!cleaned) continue;
    const lower = cleaned.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    deduped.push(cleaned);
  }

  return deduped;
}

function splitSkillPhrase(value: string): string[] {
  const tokens = value.split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return [];
  }

  const results: string[] = [];
  let current: string[] = [];

  const shouldStartNewSkill = (token: string, previous: string | undefined): boolean => {
    if (!previous) {
      return false;
    }

    if (/^(Styling:|Frontend:|Backend:|Tools:|Workflow:|Other:|Languages:)$/i.test(token)) {
      return true;
    }

    if (/^[A-Z][A-Za-z0-9.+#/-]*:?$/.test(token) || /^[a-z]+(?:\.[a-z]+)+$/i.test(token)) {
      if (/^(CSS3?|HTML5?|GitHub|Git|Figma|React(?:\.js)?|Next(?:\.js)?|Python|JavaScript|TypeScript|Bootstrap|Tailwind|Node(?:\.js)?|MongoDB|Firebase|LangChain|Django|DjangoRest|REST)$/i.test(token)) {
        return true;
      }
    }

    if (/^[A-Z][A-Za-z0-9.+#/-]*$/.test(token) && !/[:(]$/.test(previous)) {
      return true;
    }

    return false;
  };

  const pushCurrent = () => {
    const text = current.join(" ").replace(/\s+/g, " ").trim();
    if (text) {
      results.push(text);
    }
    current = [];
  };

  for (const token of tokens) {
    if (shouldStartNewSkill(token, current[current.length - 1])) {
      pushCurrent();
    }
    current.push(token);
  }

  pushCurrent();
  return results;
}

function looksLikeDateRange(value: string): boolean {
  return (
    /\b(19|20)\d{2}\b/.test(value) &&
    /-|to|continue|present|current|completed/i.test(value)
  );
}

function looksLikeCompanyHeader(value: string): boolean {
  if (!value || looksLikeDateRange(value)) {
    return false;
  }

  if (/[.!?]$/.test(value)) {
    return false;
  }

  const words = value.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 12) {
    return false;
  }

  return /,/.test(value) || /(service|solution|company|college|university|studio|agency|labs?)$/i.test(value);
}

function looksLikeEducationStart(value: string): boolean {
  if (!value) {
    return false;
  }

  return /\b(university|college|colleges|school|institute|academy|faculty)\b/i.test(value);
}

function splitEducationInlineEntries(value: string): string[] {
  const line = value.replace(/\s+/g, " ").trim();
  if (!line) {
    return [];
  }

  const institutionPattern =
    /\b(?:[A-Z][A-Za-z0-9&().'-]*\s+){0,8}(?:University|College|Colleges|School|Institute|Academy|Faculty)\b/g;
  const matches = [...line.matchAll(institutionPattern)];

  if (matches.length <= 1) {
    return [line];
  }

  const starts = matches
    .map((match) => match.index)
    .filter((index): index is number => typeof index === "number")
    .sort((a, b) => a - b);

  if (starts.length <= 1) {
    return [line];
  }

  const parts: string[] = [];

  for (let i = 0; i < starts.length; i += 1) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : line.length;
    const chunk = line.slice(start, end).trim();
    if (chunk) {
      parts.push(chunk);
    }
  }

  return parts.length ? parts : [line];
}

function parseEducationItems(lines: string[]): string[] {
  const expanded = lines
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .flatMap((line) => splitEducationInlineEntries(line));

  const items: string[] = [];
  let current: string[] = [];

  const pushCurrent = () => {
    const value = current.join(" ").replace(/\s+/g, " ").trim();
    if (value) {
      items.push(value);
    }
    current = [];
  };

  for (const line of expanded) {
    const isStart = looksLikeEducationStart(line);
    if (isStart && current.length > 0) {
      pushCurrent();
    }

    current.push(line);
  }

  pushCurrent();

  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const normalized = item.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    deduped.push(item);
  }

  return deduped;
}

function parseExperienceLikeItems(lines: string[]): string[] {
  const cleanedLines = lines.map((line) => line.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
  const items: string[] = [];
  let current: string[] = [];
  let seenDateInCurrent = false;

  const pushCurrent = () => {
    const value = current.join(" ").replace(/\s+/g, " ").trim();
    if (value) {
      items.push(value);
    }
    current = [];
    seenDateInCurrent = false;
  };

  for (const line of cleanedLines) {
    const isDateLine = looksLikeDateRange(line);
    const isCompanyLine = looksLikeCompanyHeader(line);

    if (current.length > 0 && isCompanyLine && seenDateInCurrent) {
      pushCurrent();
    }

    current.push(line);

    if (isDateLine) {
      seenDateInCurrent = true;
    }
  }

  pushCurrent();
  return items;
}

function normalizeItemsForSectionKey(key: CVSectionKey, items: string[]): string[] {
  const normalizedLines = items
    .map((item) => String(item).trim())
    .filter(Boolean);

  if (!normalizedLines.length) {
    return [];
  }

  if (key === "skills" || key === "languages") {
    // Keep each submitted chip independent so new items don't merge with the previous one.
    const expanded = normalizedLines.flatMap((line) => {
      if (key === "languages") {
        return splitLanguages(line);
      }

      const looseItems = splitLooseList(line);
      return looseItems.flatMap((item) => splitSkillPhrase(item));
    });

    const deduped: string[] = [];
    const seen = new Set<string>();
    for (const item of expanded) {
      const cleaned = item.trim();
      if (!cleaned) continue;
      const lower = cleaned.toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);
      deduped.push(cleaned);
    }
    return deduped;
  }

  return normalizedLines;
}

function splitSectionItems(section: { key: CVSectionKey; title: string }, lines: string[]): string[] {
  if (!lines.length) {
    return [];
  }

  if (section.key === "skills" || section.key === "languages") {
    return normalizeItemsForSectionKey(section.key, lines);
  }

  if (section.key === "about" || section.key === "contact") {
    return lines;
  }

  if (section.key === "education") {
    const educationItems = parseEducationItems(lines);
    if (educationItems.length) {
      return educationItems;
    }
  }

  if (section.key === "experience" || section.key === "projects") {
    const grouped = parseExperienceLikeItems(lines);
    if (grouped.length) {
      return grouped;
    }
  }

  const items: string[] = [];
  let current: string[] = [];

  const hasStrongEntrySignal = (value: string): boolean =>
    /\b(19|20)\d{2}\b/.test(value) ||
    /internship|engineer|developer|manager|designer|analyst|specialist|university|college|company|project/i.test(value);

  const isTinyFragment = (value: string): boolean => {
    if (!value || value === "-" || value === ",") {
      return true;
    }

    const words = value.split(/\s+/).filter(Boolean);
    return words.length <= 2 && value.length <= 18 && !hasStrongEntrySignal(value) && !/[.!?]$/.test(value);
  };

  const pushCurrent = () => {
    const value = current.join(" ").replace(/\s+/g, " ").trim();
    if (value) {
      items.push(value);
    }
    current = [];
  };

  for (const line of lines) {
    const cleaned = line.replace(/^[-*]\s*/, "").trim();
    if (!cleaned) {
      pushCurrent();
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      pushCurrent();
      current.push(cleaned);
      continue;
    }

    if (current.length > 0) {
      const currentTail = current[current.length - 1] || "";
      const shouldMergeIntoCurrent =
        currentTail.endsWith(",") ||
        isTinyFragment(cleaned) ||
        (isTinyFragment(currentTail) && !hasStrongEntrySignal(cleaned));

      if (shouldMergeIntoCurrent) {
        current.push(cleaned);
        continue;
      }
    }

    const looksLikeNewEntry =
      current.length > 0 &&
      (/^\d{4}\b/.test(cleaned) ||
        /\b(19|20)\d{2}\b/.test(cleaned) ||
        /internship|engineer|developer|service|university|college|project/i.test(cleaned));

    if (looksLikeNewEntry) {
      pushCurrent();
    }

    current.push(cleaned);
  }

  pushCurrent();
  return items.length ? items : lines;
}

function buildIntroSections(lines: string[]): Array<{ key: CVSectionKey; title: string; lines: string[] }> {
  const summary: string[] = [];
  const contact: string[] = [];
  const education: string[] = [];

  for (const line of lines) {
    if (
      /\b(university|college|school|bachelor|master|bs\b|b\.s\.|ms\b|m\.s\.|phd|matric|intermediate|cgpa|gpa|degree|faculty|campus)\b/i.test(
        line,
      )
    ) {
      education.push(line);
      continue;
    }

    if (
      /@/.test(line) ||
      /linkedin|github|contact\s*:|phone\s*:|email\s*:|https?:\/\/|www\./i.test(line) ||
      /\+?\d[\d\s().-]{6,}\d/.test(line)
    ) {
      contact.push(line);
    } else {
      summary.push(line);
    }
  }

  const sections: Array<{ key: CVSectionKey; title: string; lines: string[] }> = [];
  if (summary.length) {
    sections.push({ key: "about", title: "About", lines: summary });
  }
  if (education.length) {
    sections.push({ key: "education", title: "Education", lines: education });
  }
  if (contact.length) {
    sections.push({ key: "contact", title: "Contact", lines: contact });
  }
  return sections;
}

export function emptyEditorData(): CVEditorData {
  return { name: "", sections: [] };
}

export function parseCvTextToEditorData(cv: CVRecord): CVEditorData {
  const raw = String(cv.raw_text || "");
  const lines = raw.split(/\r?\n/);
  const nonEmpty = lines.map((line) => line.trim()).filter(Boolean);
  const name = nonEmpty[0] || "";

  const bodyLines = lines
    .slice(lines.findIndex((line) => line.trim() === name) + 1)
    .map((line) => line.trimEnd());

  const rawSections: Array<{ key: CVSectionKey; title: string; lines: string[] }> = [];
  let currentSection: { key: CVSectionKey; title: string; lines: string[] } | null = null;
  let introBuffer: string[] = [];

  for (const rawLine of bodyLines) {
    const line = rawLine.trim();
    if (!line) {
      if (currentSection) {
        currentSection.lines.push("");
      } else if (introBuffer.length) {
        introBuffer.push("");
      }
      continue;
    }

    if (isHeadingLine(line)) {
      if (!currentSection && introBuffer.length) {
        rawSections.push(...buildIntroSections(introBuffer.filter((item) => item.trim())));
        introBuffer = [];
      }
      if (currentSection) {
        rawSections.push(currentSection);
      }
      const section = resolveSection(line);
      currentSection = { key: section.key, title: section.title, lines: [] };
      continue;
    }

    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      introBuffer.push(line);
    }
  }

  if (!currentSection && introBuffer.length) {
    rawSections.push(...buildIntroSections(introBuffer.filter((item) => item.trim())));
  }
  if (currentSection) {
    rawSections.push(currentSection);
  }

  const sections: CVSection[] = rawSections
    .map((section, index) => ({
      id: makeSectionId(section.key, index),
      key: section.key,
      title: section.title,
      items: splitSectionItems(section, section.lines),
    }))
    .filter((section) => section.items.length || section.title.trim());

  return { name, sections };
}

export function sectionsToPayload(data: CVEditorData): Array<{ title: string; items: string[] }> {
  return data.sections.map((section) => ({
    title: section.title,
    items: section.items,
  }));
}

export function sectionsFromPayload(
  payload: Array<{ title: string; items: string[] }> | undefined,
): CVSection[] {
  if (!payload?.length) {
    return [];
  }

  return payload.map((section, index) => {
    const resolved = resolveSection(section.title);
    return {
      id: makeSectionId(resolved.key, index),
      key: resolved.key,
      title: section.title || resolved.title,
      items: normalizeItemsForSectionKey(resolved.key, splitLines((section.items || []).join("\n"))),
    };
  });
}

export function buildCvRawText(data: CVEditorData): string {
  const chunks: string[] = [];
  const name = data.name.trim();
  if (name) {
    chunks.push(name);
  }

  // Match Live Preview: contact details appear in the top header block.
  const contactSection = data.sections.find((section) => section.key === "contact");
  const contactLines = (contactSection?.items || [])
    .map((item) => item.trim())
    .filter(Boolean)
    .map((line) => {
      const normalized = line.replace(/^(contact|phone|email|github|linkedin|address|location)\s*:/i, "").trim();
      return normalized || line;
    });

  if (contactLines.length) {
    chunks.push(contactLines.join("\n"));
  }

  const listStyleKeys = new Set<CVSectionKey>([
    "skills",
    "languages",
    "certifications",
    "experience",
    "education",
    "projects",
  ]);

  for (const section of data.sections) {
    if (section.key === "contact") {
      continue;
    }

    const title = section.title.trim() || "Section";
    const items = section.items.map((item) => item.trim()).filter(Boolean);
    if (!items.length) {
      continue;
    }

    const lines: string[] = [title];

    if (section.key === "about") {
      lines.push(...items);
    } else if (listStyleKeys.has(section.key)) {
      lines.push(...items.map((item) => `- ${item}`));
    } else {
      lines.push(...items);
    }

    chunks.push(lines.join("\n"));
  }

  return chunks.join("\n\n").trim();
}

export function calculateCvDiff(previous: CVEditorData, updated: CVEditorData): CVDiff {
  const maxLength = Math.max(previous.sections.length, updated.sections.length);
  const sections = Array.from({ length: maxLength }).map((_, index) => {
    const before = previous.sections[index];
    const after = updated.sections[index];

    const previousTitle = before?.title || "";
    const updatedTitle = after?.title || "";
    const previousItems = before?.items || [];
    const updatedItems = after?.items || [];

    return {
      id: before?.id || after?.id || `diff-${index}`,
      previousTitle,
      updatedTitle,
      previousItems,
      updatedItems,
      changed:
        previousTitle.trim() !== updatedTitle.trim() || previousItems.join("\n") !== updatedItems.join("\n"),
    };
  });

  return {
    nameChanged: previous.name.trim() !== updated.name.trim(),
    sections,
  };
}

export function addItemsToSection(section: CVSection, value: string): CVSection {
  const additions = splitLines(value).map((item) => item.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
  if (!additions.length) {
    return section;
  }

  const seen = new Set(section.items.map((item) => item.toLowerCase()));
  const merged = [...section.items];
  for (const item of additions) {
    if (seen.has(item.toLowerCase())) {
      continue;
    }
    seen.add(item.toLowerCase());
    merged.push(item);
  }

  return {
    ...section,
    items: normalizeSectionItems(section, merged),
  };
}

export function normalizeSectionItems(section: CVSection, items: string[]): string[] {
  return normalizeItemsForSectionKey(
    section.key,
    items.map((item) => item.replace(/^[-*]\s*/, "").trim()).filter(Boolean),
  );
}
