import { ItemCell } from "./item-cell";

export function ListCell({ values }: { values: string[] }) {
  if (!values.length) {
    return <p className="text-xs text-stone-500">-</p>;
  }

  return (
    <ul className="grid gap-2">
      {values.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-lg border border-stone-200 bg-white px-2.5 py-2">
          <ItemCell value={item} />
        </li>
      ))}
    </ul>
  );
}
