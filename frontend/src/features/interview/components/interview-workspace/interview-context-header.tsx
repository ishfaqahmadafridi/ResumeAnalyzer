import { InterviewRoleDisplay } from "./interview-role-display";
import { InterviewCvContextDisplay } from "./interview-cv-context-display";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewContextHeader({ activeInterviewRole, latestAnalysis }: UseInterviewWorkspaceResult) {
  return (
    <div className="space-y-3">
      <InterviewRoleDisplay activeInterviewRole={activeInterviewRole} />
      <InterviewCvContextDisplay activeInterviewRole={activeInterviewRole} latestAnalysis={latestAnalysis} />
    </div>
  );
}
