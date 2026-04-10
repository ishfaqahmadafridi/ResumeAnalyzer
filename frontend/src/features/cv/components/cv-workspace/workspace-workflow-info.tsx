export function WorkspaceWorkflowInfo() {
  return (
    <div className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,247,245,0.9))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">How It Works</p>
      <div className="mt-3 space-y-3 text-sm leading-7 text-stone-700">
        <p>1. Upload your CV and we extract the readable text from the file.</p>
        <p>2. We analyze your skills, profile details, and role fit from that text.</p>
        <p>3. You get recommended roles, missing skills, and a clearer direction for improvement.</p>
      </div>
    </div>
  );
}
