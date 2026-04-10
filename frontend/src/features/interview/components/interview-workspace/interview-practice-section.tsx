import { SectionCard } from "@/components/section-card";
import { InterviewPracticeContent } from "./interview-practice-content";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewPracticeSection(props: UseInterviewWorkspaceResult) {
  return (
    <SectionCard title="Interview Practice" description="Role-aware mock interview space wired to your latest CV analysis.">
      <InterviewPracticeContent {...props} />
    </SectionCard>
  );
}
