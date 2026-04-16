import { ItemCell } from "./item-cell";

export function PairedItems({ previousValues, updatedValues }: { previousValues: string[]; updatedValues: string[] }) {
  const maxLength = Math.max(previousValues.length, updatedValues.length, 1);

  return (
    <div className="grid gap-2">
      {Array.from({ length: maxLength }).map((_, index) => {
        const previous = previousValues[index] || "";
        const updated = updatedValues[index] || "";

        return (
          <div key={`item-row-${index}`} className="grid gap-2 lg:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
              <ItemCell value={previous} />
            </div>
            <div className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
              <ItemCell value={updated} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
