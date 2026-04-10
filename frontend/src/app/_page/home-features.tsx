const features = [
  ["CV Scoring", "Role-fit breakdown with skills, missing strengths, and suggested improvements."],
  ["Interview Prep", "Mock interviewer flow with CV-aware prompts and role selection."],
  ["Final Review", "Clean preview workflow before unlocking job-agent activity."],
  ["Auto Apply", "Backend orchestration for job search, drafting, and activity reporting."],
];

export function HomeFeatures() {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white/85 p-6 shadow-[var(--shadow)]">
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map(([title, copy]) => (
          <div key={title} className="rounded-2xl bg-stone-50 p-4">
            <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
            <p className="mt-2 text-sm text-stone-600">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}