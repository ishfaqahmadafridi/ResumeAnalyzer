import { ListCell } from "./list-cell";
import { TextCell } from "./text-cell";

export function SectionComparisonBody({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <TextCell value={title.trim() || "(No section title)"} />
      <ListCell values={items} />
    </div>
  );
}
