"use client";

import { useInterviewWorkspace } from "@/features/hooks/interview/use-interview-workspace";
import { InterviewPracticeSection } from "./interview-practice-section";

export function InterviewWorkspace() {
  const workspaceData = useInterviewWorkspace();

  return (
    <div className="space-y-5">
      <InterviewPracticeSection {...workspaceData} />
    </div>
  );
}
