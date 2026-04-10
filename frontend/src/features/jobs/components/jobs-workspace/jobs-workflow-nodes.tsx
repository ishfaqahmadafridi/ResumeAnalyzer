export function JobsWorkflowNodes() {
  return (
    <div className="rounded-[26px] border border-black/10 bg-stone-950 p-5 text-stone-50 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Workflow nodes</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li>1. Profile Analyzer</li>
        <li>2. Job Searcher</li>
        <li>3. Application Agent</li>
        <li>4. Notification & Logging Agent</li>
      </ol>
    </div>
  );
}
