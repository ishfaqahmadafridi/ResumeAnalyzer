import { type DashboardMetricProps } from "@/features/types/dashboard";
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
