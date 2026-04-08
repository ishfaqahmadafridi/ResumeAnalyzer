import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-16 lg:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">CVForge AI</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-stone-950">
            Analyze your CV, rehearse interviews, and stage job applications from one AI workspace.
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            Built for role targeting, skill matching, interview practice, final CV review, and automated multi-step
            application workflows.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register" className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-50">
              Create account
            </Link>
            <Link href="/auth/login" className="rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-900">
              Sign in
            </Link>
          </div>
        </section>
        <section className="rounded-[32px] border border-black/10 bg-white/85 p-6 shadow-[var(--shadow)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["CV Scoring", "Role-fit breakdown with skills, missing strengths, and suggested improvements."],
              ["Interview Prep", "Mock interviewer flow with CV-aware prompts and role selection."],
              ["Final Review", "Clean preview workflow before unlocking job-agent activity."],
              ["Auto Apply", "Backend orchestration for job search, drafting, and activity reporting."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-stone-50 p-4">
                <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
                <p className="mt-2 text-sm text-stone-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
