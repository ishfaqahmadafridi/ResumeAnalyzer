export function WorkspaceWorkflowSteps() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
      <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 1</p>
        <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Extract readable text</p>
      </div>
      <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 2</p>
        <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Analyze role signals</p>
      </div>
      <div className="rounded-[24px] border border-black/8 bg-white/86 px-4 py-4 shadow-[0_12px_24px_rgba(39,39,32,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Step 3</p>
        <p className="mt-3 text-lg font-semibold leading-7 text-stone-950">Surface next skills</p>
      </div>
    </div>
  );
}
