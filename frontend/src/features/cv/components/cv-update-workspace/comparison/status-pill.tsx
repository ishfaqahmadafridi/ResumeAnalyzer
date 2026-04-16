export function StatusPill({ changed }: { changed: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        changed ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
      }`}
    >
      {changed ? "Changed" : "Unchanged"}
    </span>
  );
}
