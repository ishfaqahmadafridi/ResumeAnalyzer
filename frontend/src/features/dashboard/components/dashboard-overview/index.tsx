"use client";

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
