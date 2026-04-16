import type { CVDiff, CVEditorData } from "@/features/cv/types/update";
import { RowFrame } from "./row-frame";
import { TextCell } from "./text-cell";

type NameComparisonRowProps = {
  previous: CVEditorData;
  updated: CVEditorData;
  diff: CVDiff;
};

export function NameComparisonRow({ previous, updated, diff }: NameComparisonRowProps) {
  return (
    <RowFrame
      title="Name"
      changed={diff.nameChanged}
      left={<TextCell value={previous.name} />}
      right={<TextCell value={updated.name} />}
    />
  );
}
