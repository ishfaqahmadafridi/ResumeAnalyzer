export function MetricRoleFit({ ratio }: { ratio: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,255,0.84))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Role fit ratio</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{ratio}%</p>
      <p className="mt-2 text-sm text-stone-600">Best live role-match signal from the recommendation engine.</p>
    </section>
  );
}
