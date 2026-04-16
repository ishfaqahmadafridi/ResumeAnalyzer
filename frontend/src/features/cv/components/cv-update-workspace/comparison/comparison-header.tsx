export function ComparisonHeader() {
  return (
    <div className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 lg:grid-cols-[220px_1fr_1fr]">
      <p className="hidden text-xs font-semibold uppercase tracking-wide text-stone-500 lg:block">Section</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Previous CV</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Updated CV</p>
    </div>
  );
}
