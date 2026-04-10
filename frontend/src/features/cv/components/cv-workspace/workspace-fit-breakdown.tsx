import { CVAnalysisResultsStrengths } from "@/features/cv/components/CVAnalysisResults/CVAnalysisResultsStrengths";
import { WorkspaceFitScores } from "./workspace-fit-scores";
import { WorkspaceFitSkills } from "./workspace-fit-skills";
import type { UseCVWorkspaceResult } from "@/features/types/cv/workspace";

export function WorkspaceFitBreakdown({ analysis }: UseCVWorkspaceResult) {
  if (!analysis) {
    return (
      <p className="text-sm text-stone-500">
        Role analysis will appear here after you upload a CV and choose a suggested role or enter your own role.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspaceFitScores roleScore={analysis.role_specific_cv_score} matchedPercentage={analysis.matched_skills_percentage} />
      <CVAnalysisResultsStrengths strengths={analysis.matched_skills} roleName={analysis.role} cvSkills={analysis.your_skills} />
      <WorkspaceFitSkills missingSkills={analysis.missing_skills} recommendedSkills={analysis.recommended_skills} />
    </div>
  );
}
