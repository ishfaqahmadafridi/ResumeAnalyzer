export function ItemCell({ value }: { value: string }) {
  if (!value.trim()) {
    return <p className="text-xs text-stone-400">-</p>;
  }

  return <p className="text-xs leading-5 break-words text-stone-700">{value}</p>;
}
