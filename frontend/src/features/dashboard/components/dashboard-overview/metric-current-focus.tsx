export function MetricCurrentFocus({ focus }: { focus: string }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-white/96 p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Current focus</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{focus}</p>
      <p className="mt-2 text-sm text-stone-600">This role is guiding your current skill-fit and improvement direction.</p>
    </section>
  );
}
