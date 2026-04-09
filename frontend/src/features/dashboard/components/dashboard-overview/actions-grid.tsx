import { ChartImprovementAreas } from "./chart-improvement-areas";
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
