import type { CVSectionKey } from "@/features/cv/types/update";

export function isListStyleSection(key: CVSectionKey): boolean {
  return (
    key === "skills" ||
    key === "languages" ||
    key === "certifications" ||
    key === "experience" ||
    key === "education" ||
    key === "projects"
  );
}
