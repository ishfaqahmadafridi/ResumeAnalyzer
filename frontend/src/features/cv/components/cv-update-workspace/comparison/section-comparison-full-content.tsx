import { PairedItems } from "./paired-items";
import { SectionComparisonTitleCells } from "./section-comparison-title-cells";

export function SectionComparisonFullContent({
  previousTitle,
  updatedTitle,
  previousItems,
  updatedItems,
}: {
  previousTitle: string;
  updatedTitle: string;
  previousItems: string[];
  updatedItems: string[];
}) {
  return (
    <div className="grid gap-2">
      <SectionComparisonTitleCells previousTitle={previousTitle} updatedTitle={updatedTitle} />
      <PairedItems previousValues={previousItems} updatedValues={updatedItems} />
    </div>
  );
}
