import { InterviewContextHeader } from "./interview-context-header";
import { InterviewChatContainer } from "./interview-chat-container";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewPracticeContent(props: UseInterviewWorkspaceResult) {
  return (
    <div className="space-y-4">
      <InterviewContextHeader {...props} />
      <InterviewChatContainer {...props} />
    </div>
  );
}
