import { useAppSelector } from "@/store";
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
