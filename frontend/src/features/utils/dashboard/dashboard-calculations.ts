import type { CVRoleAnalysis } from "@/types";

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
