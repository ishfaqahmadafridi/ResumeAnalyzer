export function TextCell({ value }: { value: string }) {
  return <p className="whitespace-pre-wrap break-words text-xs leading-5 text-stone-700">{value || "-"}</p>;
}
