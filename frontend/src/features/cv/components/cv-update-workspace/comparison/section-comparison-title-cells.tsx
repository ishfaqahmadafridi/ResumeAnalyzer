import { TextCell } from "./text-cell";

export function SectionComparisonTitleCells({ previousTitle, updatedTitle }: { previousTitle: string; updatedTitle: string }) {
  return (
    <div className="grid gap-2 lg:grid-cols-2">
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
        <TextCell value={previousTitle.trim() || "(No section title)"} />
      </div>
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
        <TextCell value={updatedTitle.trim() || "(No section title)"} />
      </div>
    </div>
  );
}
