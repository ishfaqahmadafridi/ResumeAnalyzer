export function MetricApplications({ count }: { count: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,239,0.84))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Applications today</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-rose-600">{count}</p>
      <p className="mt-2 text-sm text-stone-600">Tracked activity connected to your current profile.</p>
    </section>
  );
}
