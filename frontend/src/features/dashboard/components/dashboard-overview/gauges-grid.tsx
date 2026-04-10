import { GaugeCurrentRatio } from "./gauge-current-ratio";
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
