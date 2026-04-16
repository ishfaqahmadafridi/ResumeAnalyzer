import type { SectionDiff } from "@/features/cv/types/update";
import { RowFrame } from "./row-frame";
import { SectionComparisonBody } from "./section-comparison-body";
import { SectionComparisonFullContent } from "./section-comparison-full-content";
import { sectionTitle } from "./section-title";

export function SectionComparisonRow({ section, index }: { section: SectionDiff; index: number }) {
  return (
    <RowFrame
      title={sectionTitle(section.updatedTitle || section.previousTitle, index)}
      changed={section.changed}
      left={<SectionComparisonBody title={section.previousTitle} items={section.previousItems} />}
      right={<SectionComparisonBody title={section.updatedTitle} items={section.updatedItems} />}
      full={
        <SectionComparisonFullContent
          previousTitle={section.previousTitle}
          updatedTitle={section.updatedTitle}
          previousItems={section.previousItems}
          updatedItems={section.updatedItems}
        />
      }
    />
  );
}
