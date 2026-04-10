import os

base_dir = "C:/Users/DELL/Desktop/langGrapgh/frontend/src/features"
dashboard_dir = os.path.join(base_dir, "dashboard")
components_dir = os.path.join(dashboard_dir, "components", "dashboard-overview")

features_hooks_dashboard = os.path.join(base_dir, "hooks", "dashboard")
features_types_dashboard = os.path.join(base_dir, "types", "dashboard")
features_utils_dashboard = os.path.join(base_dir, "utils", "dashboard")

os.makedirs(components_dir, exist_ok=True)
os.makedirs(features_hooks_dashboard, exist_ok=True)
os.makedirs(features_types_dashboard, exist_ok=True)
os.makedirs(features_utils_dashboard, exist_ok=True)

files = {}

# types/dashboard/index.ts
files[os.path.join(features_types_dashboard, "index.ts")] = """export interface MatchBreakdownType {
  name: string;
  match: number;
}

export interface ImprovementDataType {
  skill: string;
  weight: number;
}

export interface ActivityTrendType {
  month: string;
  score: number;
  target: number;
}

export interface StackedMonthlyType {
  month: string;
  cv: number;
  interviews: number;
  apply: number;
}

export interface DashboardMetricProps {
  score: number;
  applicationsToday: number;
  roleFitRatio: number;
  selectedRoleShort: string;
}

export interface DashboardChartProps {
  score: number;
  analysis: any;
  safeMatchBreakdown: MatchBreakdownType[];
  activityTrend: ActivityTrendType[];
  stackedMonthly: StackedMonthlyType[];
  improvementData: ImprovementDataType[];
}
"""

# utils/dashboard/dashboard-calculations.ts
files[os.path.join(features_utils_dashboard, "dashboard-calculations.ts")] = """import type { CVRoleAnalysis } from "@/types";

export function calculateMatchBreakdown(analysis: CVRoleAnalysis | null, score: number) {
  const matchBreakdown = (analysis?.recommended_roles ?? []).map((role) => ({
    name: role.role.replace(" Developer", ""),
    match: role.matched_skills_percentage,
  }));

  return matchBreakdown.length
    ? matchBreakdown
    : [
        { name: "Frontend", match: score },
        { name: "Interview", match: Math.max(score - 12, 8) },
        { name: "Jobs", match: Math.max(score - 18, 5) },
      ];
}

export function calculateImprovementData(analysis: CVRoleAnalysis | null) {
  return (analysis?.analysis?.missing_skills ?? []).slice(0, 5).map((skill, index) => ({
    skill,
    weight: 100 - index * 15,
  }));
}

export function generateActivityTrend(score: number) {
  return [
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
}

export function generateStackedMonthly(score: number) {
  return [
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
}
"""

# hooks/dashboard/use-dashboard-data.ts
files[os.path.join(features_hooks_dashboard, "use-dashboard-data.ts")] = """import { useAppSelector } from "@/store";
import { parseJson } from "@/lib/utils";
import type { CVRoleAnalysis } from "@/types";
import { 
  calculateMatchBreakdown, 
  calculateImprovementData, 
  generateActivityTrend, 
  generateStackedMonthly 
} from "@/features/utils/dashboard/dashboard-calculations";

export function useDashboardData() {
  const user = useAppSelector((state: any) => state.auth.user);
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
  const activeCv = cvs.find((cv: any) => cv.id === selectedCvId) ?? cvs[0] ?? null;

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
  
  const safeMatchBreakdown = calculateMatchBreakdown(analysis, score);
  const improvementData = calculateImprovementData(analysis);
  const activityTrend = generateActivityTrend(score);
  const stackedMonthly = generateStackedMonthly(score);

  const selectedRoleShort = roleName.length > 24 ? `${roleName.slice(0, 24)}...` : roleName;

  return {
    user,
    analysis,
    score,
    safeMatchBreakdown,
    improvementData,
    activityTrend,
    stackedMonthly,
    selectedRoleShort,
  };
}
"""


# components/dashboard-overview/index.tsx
files[os.path.join(components_dir, "index.tsx")] = """"use client";

import { useDashboardData } from "@/features/hooks/dashboard/use-dashboard-data";
import { MetricsGrid } from "./metrics-grid";
import { GaugesGrid } from "./gauges-grid";
import { TrendsGrid } from "./trends-grid";
import { ActionsGrid } from "./actions-grid";

export function DashboardOverview() {
  const {
    user,
    analysis,
    score,
    safeMatchBreakdown,
    improvementData,
    activityTrend,
    stackedMonthly,
    selectedRoleShort,
  } = useDashboardData();

  return (
    <div className="space-y-4">
      <MetricsGrid 
        score={score}
        applicationsToday={user?.profile?.applications_today ?? 0}
        roleFitRatio={safeMatchBreakdown[0]?.match ?? score}
        selectedRoleShort={selectedRoleShort}
      />
      <GaugesGrid 
        score={score}
        analysis={analysis}
        safeMatchBreakdown={safeMatchBreakdown}
      />
      <TrendsGrid 
        activityTrend={activityTrend}
        stackedMonthly={stackedMonthly}
      />
      <ActionsGrid 
        improvementData={improvementData}
        analysis={analysis}
        user={user}
      />
    </div>
  );
}
"""

# components/dashboard-overview/metrics-grid.tsx
files[os.path.join(components_dir, "metrics-grid.tsx")] = """import { type DashboardMetricProps } from "@/features/types/dashboard";
import { MetricScore } from "./metric-score";
import { MetricApplications } from "./metric-applications";
import { MetricRoleFit } from "./metric-role-fit";
import { MetricCurrentFocus } from "./metric-current-focus";

export function MetricsGrid({ score, applicationsToday, roleFitRatio, selectedRoleShort }: DashboardMetricProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr]">
      <MetricScore score={score} />
      <MetricApplications count={applicationsToday} />
      <MetricRoleFit ratio={roleFitRatio} />
      <MetricCurrentFocus focus={selectedRoleShort} />
    </div>
  );
}
"""

# components/dashboard-overview/metric-score.tsx
files[os.path.join(components_dir, "metric-score.tsx")] = """export function MetricScore({ score }: { score: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(237,245,255,0.82))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">CV strength score</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-sky-900">{score}</p>
      <p className="mt-2 text-sm text-stone-600">Latest role-specific score from your most recent CV analysis.</p>
    </section>
  );
}
"""

# components/dashboard-overview/metric-applications.tsx
files[os.path.join(components_dir, "metric-applications.tsx")] = """export function MetricApplications({ count }: { count: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,240,239,0.84))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Applications today</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-rose-600">{count}</p>
      <p className="mt-2 text-sm text-stone-600">Tracked activity connected to your current profile.</p>
    </section>
  );
}
"""

# components/dashboard-overview/metric-role-fit.tsx
files[os.path.join(components_dir, "metric-role-fit.tsx")] = """export function MetricRoleFit({ ratio }: { ratio: number }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,255,0.84))] p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Role fit ratio</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{ratio}%</p>
      <p className="mt-2 text-sm text-stone-600">Best live role-match signal from the recommendation engine.</p>
    </section>
  );
}
"""

# components/dashboard-overview/metric-current-focus.tsx
files[os.path.join(components_dir, "metric-current-focus.tsx")] = """export function MetricCurrentFocus({ focus }: { focus: string }) {
  return (
    <section className="rounded-[26px] border border-black/8 bg-white/96 p-5 shadow-[var(--shadow)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">Current focus</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none text-stone-950">{focus}</p>
      <p className="mt-2 text-sm text-stone-600">This role is guiding your current skill-fit and improvement direction.</p>
    </section>
  );
}
"""

# components/dashboard-overview/gauges-grid.tsx
files[os.path.join(components_dir, "gauges-grid.tsx")] = """import { GaugeCurrentRatio } from "./gauge-current-ratio";
import { GaugeTopBlockers } from "./gauge-top-blockers";
import { GaugeReadyImprove } from "./gauge-ready-improve";
import { ChartRoleMatch } from "./chart-role-match";
import type { MatchBreakdownType } from "@/features/types/dashboard";

interface Props {
  score: number;
  analysis: any;
  safeMatchBreakdown: MatchBreakdownType[];
}

export function GaugesGrid({ score, analysis, safeMatchBreakdown }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_0.95fr_1.35fr]">
      <GaugeCurrentRatio score={score} />
      <GaugeTopBlockers missingCount={analysis?.analysis?.missing_skills?.length ?? 0} />
      <GaugeReadyImprove score={score} />
      <ChartRoleMatch matchData={safeMatchBreakdown} />
    </div>
  );
}
"""

# components/dashboard-overview/gauge-current-ratio.tsx
files[os.path.join(components_dir, "gauge-current-ratio.tsx")] = """import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeCurrentRatio({ score }: { score: number }) {
  const hydrated = useHydrated();
  return (
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
  );
}
"""

# components/dashboard-overview/gauge-top-blockers.tsx
files[os.path.join(components_dir, "gauge-top-blockers.tsx")] = """import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeTopBlockers({ missingCount }: { missingCount: number }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Top blockers" description="Skill gaps slowing stronger role alignment.">
      <div className="h-[210px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              data={[{ score: Math.max(missingCount * 12, 18) }]}
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
        <span>{missingCount} skills</span>
        <span>8+</span>
      </div>
    </SectionCard>
  );
}
"""

# components/dashboard-overview/gauge-ready-improve.tsx
files[os.path.join(components_dir, "gauge-ready-improve.tsx")] = """import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";

export function GaugeReadyImprove({ score }: { score: number }) {
  const hydrated = useHydrated();
  return (
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
  );
}
"""

# components/dashboard-overview/chart-role-match.tsx
files[os.path.join(components_dir, "chart-role-match.tsx")] = """import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { MatchBreakdownType } from "@/features/types/dashboard";

export function ChartRoleMatch({ matchData }: { matchData: MatchBreakdownType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Role Match Comparison" description="Current role recommendations and match percentages.">
      <div className="h-[260px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matchData} barCategoryGap={26}>
              <CartesianGrid vertical={false} stroke="#e8e2d7" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="match" radius={[12, 12, 0, 0]}>
                {matchData.map((entry, index) => (
                  <Cell key={entry.name} fill={index === 0 ? "#36659a" : index === 1 ? "#f17c5b" : "#8398b6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
"""

# components/dashboard-overview/trends-grid.tsx
files[os.path.join(components_dir, "trends-grid.tsx")] = """import { ChartTrendLine } from "./chart-trend-line";
import { ChartStackedBar } from "./chart-stacked-bar";
import type { ActivityTrendType, StackedMonthlyType } from "@/features/types/dashboard";

interface Props {
  activityTrend: ActivityTrendType[];
  stackedMonthly: StackedMonthlyType[];
}

export function TrendsGrid({ activityTrend, stackedMonthly }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
      <ChartTrendLine trendData={activityTrend} />
      <ChartStackedBar stackedData={stackedMonthly} />
    </div>
  );
}
"""

# components/dashboard-overview/chart-trend-line.tsx
files[os.path.join(components_dir, "chart-trend-line.tsx")] = """import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { ActivityTrendType } from "@/features/types/dashboard";

export function ChartTrendLine({ trendData }: { trendData: ActivityTrendType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="CV Momentum Trend" description="A board-style trend of your score against a stronger target path.">
      <div className="h-[330px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
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
  );
}
"""

# components/dashboard-overview/chart-stacked-bar.tsx
files[os.path.join(components_dir, "chart-stacked-bar.tsx")] = """import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { StackedMonthlyType } from "@/features/types/dashboard";

export function ChartStackedBar({ stackedData }: { stackedData: StackedMonthlyType[] }) {
  const hydrated = useHydrated();
  return (
    <SectionCard title="Platform Activity Mix" description="How your CV work, interview prep, and applications stack up across the year.">
      <div className="h-[330px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid stroke="#ebe4d8" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="cv" stackId="a" fill="#365f93" radius={[0, 0, 0, 0]} />
              <Bar dataKey="interviews" stackId="a" fill="#f0a928" radius={[0, 0, 0, 0]} />
              <Bar dataKey="apply" stackId="a" fill="#18a957" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
"""

# components/dashboard-overview/actions-grid.tsx
files[os.path.join(components_dir, "actions-grid.tsx")] = """import { ChartImprovementAreas } from "./chart-improvement-areas";
import { QuickActionsBlock } from "./quick-actions-block";
import type { ImprovementDataType } from "@/features/types/dashboard";

interface Props {
  improvementData: ImprovementDataType[];
  analysis: any;
  user: any;
}

export function ActionsGrid({ improvementData, analysis, user }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <ChartImprovementAreas improvementData={improvementData} />
      <QuickActionsBlock analysis={analysis} user={user} />
    </div>
  );
}
"""

# components/dashboard-overview/chart-improvement-areas.tsx
files[os.path.join(components_dir, "chart-improvement-areas.tsx")] = """import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/ui/section-card";
import { useHydrated } from "@/hooks/use-hydrated";
import type { ImprovementDataType } from "@/features/types/dashboard";

export function ChartImprovementAreas({ improvementData }: { improvementData: ImprovementDataType[] }) {
  const hydrated = useHydrated();
  const dataToUse = improvementData.length ? improvementData : [{ skill: "Upload CV", weight: 80 }];
  return (
    <SectionCard title="Improvement Areas" description="Top missing skills blocking stronger role fit.">
      <div className="h-[250px]">
        {hydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataToUse}>
              <CartesianGrid stroke="#ebe4d8" vertical={false} />
              <XAxis dataKey="skill" hide />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="weight" radius={[18, 18, 6, 6]} fill="#c76b2f" />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </SectionCard>
  );
}
"""

# components/dashboard-overview/quick-actions-block.tsx
files[os.path.join(components_dir, "quick-actions-block.tsx")] = """import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";
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
"""

import sys

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(files)} files successfully.")
