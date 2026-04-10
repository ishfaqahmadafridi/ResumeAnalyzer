import { ChartTrendLine } from "./chart-trend-line";
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
