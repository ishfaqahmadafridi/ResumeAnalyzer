"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { useHydrated } from "@/hooks/use-hydrated";
import type { CVRoleAnalysis } from "@/types";

export function DashboardOverview() {
  const hydrated = useHydrated();
  const user = useAppSelector((state) => state.auth.user);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const activeCv = cvs.find((cv) => cv.id === selectedCvId) ?? cvs[0] ?? null;
  const analysis = activeCv?.latest_analysis
    ? parseJson<CVRoleAnalysis>(
        activeCv.latest_analysis.full_json_state,
        {
          structured_data: {},
          recommended_roles: [],
          analysis: null,
          score: activeCv.latest_analysis.score,
        } as CVRoleAnalysis,
      )
    : null;

  const score = analysis?.score ?? 0;
  const roleName = analysis?.analysis?.role ?? activeCv?.recommended_roles?.[0]?.title ?? "No role selected yet";
  const matchBreakdown = (analysis?.recommended_roles ?? []).map((role) => ({
    name: role.role.replace(" Developer", ""),
    match: role.matched_skills_percentage,
  }));
  const improvementData = (analysis?.analysis?.missing_skills ?? []).slice(0, 5).map((skill, index) => ({
    skill,
    weight: 100 - index * 15,
  }));

  const safeMatchBreakdown = matchBreakdown.length
    ? matchBreakdown
    : [
        { name: "Frontend", match: score },
        { name: "Interview", match: Math.max(score - 12, 8) },
        { name: "Jobs", match: Math.max(score - 18, 5) },
      ];

  const activityTrend = [
    { month: "Jan", score: Math.max(score - 34, 8), target: 46 },
    { month: "Feb", score: Math.max(score - 28, 10), target: 50 },
    { month: "Mar", score: Math.max(score - 22, 16), target: 54 },
    { month: "Apr", score: Math.max(score - 14, 24), target: 60 },
    { month: "May", score: Math.max(score - 8, 28), target: 66 },
    { month: "Jun", score: Math.max(score - 3, 32), target: 70 },
    { month: "Jul", score: Math.max(score + 6, 38), target: 74 },
    { month: "Aug", score: Math.max(score - 10, 24), target: 62 },
    { month: "Sep", score: Math.max(score - 4, 34), target: 76 },
    { month: "Oct", score: Math.max(score + 4, 40), target: 82 },
    { month: "Nov", score: Math.max(score + 8, 46), target: 88 },
    { month: "Dec", score: Math.max(score - 6, 30), target: 72 },
  ];

  const stackedMonthly = [
    { month: "Jan", cv: Math.max(score - 10, 12), interviews: 16, apply: 10 },
    { month: "Feb", cv: Math.max(score - 6, 14), interviews: 18, apply: 12 },
    { month: "Mar", cv: Math.max(score - 3, 18), interviews: 16, apply: 14 },
    { month: "Apr", cv: Math.max(score + 2, 22), interviews: 20, apply: 16 },
    { month: "May", cv: Math.max(score + 4, 24), interviews: 21, apply: 18 },
    { month: "Jun", cv: Math.max(score + 6, 26), interviews: 24, apply: 18 },
    { month: "Jul", cv: Math.max(score + 8, 28), interviews: 24, apply: 20 },
    { month: "Aug", cv: Math.max(score + 10, 30), interviews: 26, apply: 22 },
    { month: "Sep", cv: Math.max(score + 12, 33), interviews: 28, apply: 24 },
    { month: "Oct", cv: Math.max(score + 14, 36), interviews: 30, apply: 24 },
    { month: "Nov", cv: Math.max(score + 16, 38), interviews: 32, apply: 26 },
    { month: "Dec", cv: Math.max(score + 18, 40), interviews: 34, apply: 28 },
  ];

  const selectedRoleShort = roleName.length > 24 ? `${roleName.slice(0, 24)}...` : roleName;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr]">
        <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(237,245,255,0.82))] p-5 shadow-[var(--shadow)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">CV strength score</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-sky-900">{score}</p>
          <p className="mt-2 text-sm text-stone-600">Latest role-specific score from your most recent CV analysis.</p>
        </section>

        <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,239,0.84))] p-5 shadow-[var(--shadow)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Applications today</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-rose-600">{user?.profile?.applications_today ?? 0}</p>
          <p className="mt-2 text-sm text-stone-600">Tracked activity connected to your current profile.</p>
        </section>

        <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,255,0.84))] p-5 shadow-[var(--shadow)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Role fit ratio</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{safeMatchBreakdown[0]?.match ?? score}%</p>
          <p className="mt-2 text-sm text-stone-600">Best live role-match signal from the recommendation engine.</p>
        </section>

        <section className="rounded-[26px] border border-black/8 bg-white/96 p-5 shadow-[var(--shadow)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Current focus</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{selectedRoleShort}</p>
          <p className="mt-2 text-sm text-stone-600">This role is guiding your current skill-fit and improvement direction.</p>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_0.95fr_1.35fr]">
        <SectionCard title="Current ratio" description="A quick dial for your present CV health.">
          <div className="h-[210px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ score }]} startAngle={90} endAngle={-270}>
                  <PolarGrid radialLines={false} stroke="#d6d0c4" />
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="score" cornerRadius={18} fill="#36659a" />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <span>0</span>
            <span>{score}%</span>
            <span>100</span>
          </div>
        </SectionCard>

        <SectionCard title="Top blockers" description="Skill gaps slowing stronger role alignment.">
          <div className="h-[210px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="68%"
                  outerRadius="100%"
                  data={[{ score: Math.max((analysis?.analysis?.missing_skills.length ?? 0) * 12, 18) }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarGrid radialLines={false} stroke="#e6ddd1" />
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="score" cornerRadius={18} fill="#f5a623" />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <span>0</span>
            <span>{analysis?.analysis?.missing_skills.length ?? 0} skills</span>
            <span>8+</span>
          </div>
        </SectionCard>

        <SectionCard title="Ready to improve" description="How much room your CV still has to grow.">
          <div className="h-[210px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ score: Math.max(100 - score, 12) }]} startAngle={90} endAngle={-270}>
                  <PolarGrid radialLines={false} stroke="#e6ddd1" />
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="score" cornerRadius={18} fill="#18a957" />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <span>0</span>
            <span>{Math.max(100 - score, 0)} points</span>
            <span>100</span>
          </div>
        </SectionCard>

        <SectionCard title="Role Match Comparison" description="Current role recommendations and match percentages.">
          <div className="h-[260px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeMatchBreakdown} barCategoryGap={26}>
                  <CartesianGrid vertical={false} stroke="#e8e2d7" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="match" radius={[12, 12, 0, 0]}>
                    {safeMatchBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={index === 0 ? "#36659a" : index === 1 ? "#f17c5b" : "#8398b6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
        <SectionCard title="CV Momentum Trend" description="A board-style trend of your score against a stronger target path.">
          <div className="h-[330px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTrend}>
                  <CartesianGrid stroke="#ebe4d8" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#365f93" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="target" stroke="#f0a928" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Platform Activity Mix" description="How your CV work, interview prep, and applications stack up across the year.">
          <div className="h-[330px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedMonthly}>
                  <CartesianGrid stroke="#ebe4d8" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="cv" stackId="a" fill="#365f93" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interviews" stackId="a" fill="#f0a928" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="apply" stackId="a" fill="#18a957" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Improvement Areas" description="Top missing skills blocking stronger role fit.">
          <div className="h-[250px]">
            {hydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={improvementData.length ? improvementData : [{ skill: "Upload CV", weight: 80 }]}>
                  <CartesianGrid stroke="#ebe4d8" vertical={false} />
                  <XAxis dataKey="skill" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="weight" radius={[18, 18, 6, 6]} fill="#c76b2f" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </SectionCard>

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
      </div>
    </div>
  );
}
