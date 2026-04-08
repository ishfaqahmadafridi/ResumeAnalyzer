"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QUICK_ACTIONS } from "@/lib/constants";
import { parseJson } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { CVRoleAnalysis } from "@/types";

export function DashboardOverview() {
  const hydrated = useHydrated();
  const user = useAppSelector((state) => state.auth.user);
  const cvs = useAppSelector((state) => state.cv.items);
  const latestCv = cvs[0] ?? null;
  const analysis = latestCv?.latest_analysis
    ? parseJson<CVRoleAnalysis>(
        latestCv.latest_analysis.full_json_state,
        {
          structured_data: {},
          recommended_roles: [],
          analysis: null,
          score: latestCv.latest_analysis.score,
        } as CVRoleAnalysis,
      )
    : null;

  const score = analysis?.score ?? 0;
  const roleName = analysis?.analysis?.role ?? latestCv?.recommended_roles?.[0]?.title ?? "No role selected yet";
  const matchBreakdown = (analysis?.recommended_roles ?? []).map((role) => ({
    name: role.role.replace(" Developer", ""),
    match: role.matched_skills_percentage,
  }));
  const improvementData = (analysis?.analysis?.missing_skills ?? []).slice(0, 5).map((skill, index) => ({
    skill,
    weight: 100 - index * 15,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(212,230,218,0.75))] p-7 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          {user?.first_name ? `${user.first_name}, your career systems are live.` : "Your career systems are live."}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-stone-600">
          Track your CV quality, role fit, interview prep, and job-agent activity from one responsive workspace.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="CV Score" value={`${score}`} detail="Latest role-specific score from your current CV analysis." tone="success" />
        <StatCard title="Selected Role" value={roleName} detail="This is the role currently driving your skill fit and interview practice." />
        <StatCard
          title="Applications Today"
          value={`${user?.profile?.applications_today ?? 0}`}
          detail="Current tracked count from your profile activity."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Overall CV Health" description="A quick visual summary of your latest analysis result.">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="h-[220px]">
              {hydrated ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ score }]} startAngle={90} endAngle={-270}>
                    <PolarGrid radialLines={false} stroke="#d6d0c4" />
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="score" cornerRadius={18} fill="#14532d" />
                  </RadialBarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                {analysis?.analysis
                  ? `Your strongest alignment is ${analysis.analysis.role}. Focus next on ${analysis.analysis.missing_skills.slice(0, 2).join(" and ") || "deepening measurable impact"}.`
                  : "Upload a CV to unlock scorecards, role recommendations, and improvement trends."}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="rounded-2xl border border-black/10 bg-stone-950 px-4 py-4 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Improvement Areas" description="Top missing skills blocking stronger role fit.">
          <div className="h-[260px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={improvementData}>
                  <XAxis dataKey="skill" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="weight" radius={[18, 18, 6, 6]} fill="#c76b2f" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Role Match Breakdown" description="Recommended roles and how strongly your CV currently aligns.">
        <div className="h-[320px]">
          {hydrated ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchBreakdown}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="match" radius={[14, 14, 0, 0]} fill="#14532d" />
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
