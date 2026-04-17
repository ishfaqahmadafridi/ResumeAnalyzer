import type { CVSection } from "@/features/cv/types/update";

export function sectionLabel(section: CVSection): string {
  return section.title?.trim() || "Section";
}
