import type { CVDiff, CVEditorData } from "@/features/cv/types/update";
import { ComparisonHeader } from "./comparison-header";
import { ComparisonSections } from "./comparison-sections";
import { NameComparisonRow } from "./name-comparison-row";

export function UpdateCVComparison({
  previous,
  updated,
  diff,
}: {
  previous: CVEditorData;
  updated: CVEditorData;
  diff: CVDiff;
}) {
  return (
    <div className="space-y-3">
      <ComparisonHeader />
      <NameComparisonRow previous={previous} updated={updated} diff={diff} />
      <ComparisonSections sections={diff.sections} />
    </div>
  );
}
