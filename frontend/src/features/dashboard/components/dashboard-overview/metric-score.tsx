export function MetricScore({ score }: { score: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(237,245,255,0.82))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">CV strength score</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-sky-900">{score}</p>
      <p className="mt-2 text-sm text-stone-600">Latest role-specific score from your most recent CV analysis.</p>
    </section>
  );
}
