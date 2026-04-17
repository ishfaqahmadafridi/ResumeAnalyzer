import type { SectionDiff } from "@/features/cv/types/update";
import { SectionComparisonRow } from "./section-comparison-row";

export function ComparisonSections({ sections }: { sections: SectionDiff[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <SectionComparisonRow key={section.id} section={section} index={index} />
      ))}
    </>
  );
}
