import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { QUICK_ACTIONS } from "@/lib/constants";

interface Props {
  analysis: any;
  user: any;
}

export function QuickActionsBlock({ analysis, user }: Props) {
  return (
    <SectionCard title="Quick Actions" description="Jump back into the next workflow from your dashboard.">
      <div className="grid gap-3">
        {QUICK_ACTIONS.map((action, index) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between rounded-[22px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,243,239,0.94))] px-4 py-4 text-sm font-semibold text-stone-900 transition hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(40,40,34,0.06)]"
          >
            <span>{action.label}</span>
            <span className="text-xs uppercase tracking-[0.16em] text-stone-500">0{index + 1}</span>
          </Link>
        ))}
        <div className="rounded-[22px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(234,250,241,0.9),rgba(255,255,255,0.95))] px-4 py-4">
          <p className="text-sm font-semibold text-stone-950">
            {analysis?.analysis
              ? `Focus next on ${analysis.analysis.missing_skills.slice(0, 2).join(" and ") || "measurable outcomes"}.`
              : "Upload a CV to unlock stronger role signals, charts, and improvement guidance."}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            {user?.first_name ? `${user.first_name}, this board updates as your latest CV analysis changes.` : "This board updates as your latest CV analysis changes."}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
