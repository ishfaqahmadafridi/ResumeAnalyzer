export interface MatchBreakdownType {
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
