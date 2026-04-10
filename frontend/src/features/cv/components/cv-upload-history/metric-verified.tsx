export function MetricVerified({ count }: { count: number }) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white/86 px-5 py-5 shadow-[0_16px_28px_rgba(43,43,35,0.04)]">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Verified</p>
      <p className="mt-3 text-[2.6rem] font-semibold leading-none text-stone-950">{count}</p>
      <p className="mt-3 text-sm leading-6 text-stone-600">Readable CVs successfully extracted during the last week.</p>
    </div>
  );
}
