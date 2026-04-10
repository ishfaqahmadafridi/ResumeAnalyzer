import { InterviewChatInputWrapper } from "./interview-chat-input-wrapper";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewChatInputContainer(props: UseInterviewWorkspaceResult) {
  return (
    <div className="mt-4 rounded-[24px] border border-white/10 bg-white/8 p-3">
      <InterviewChatInputWrapper {...props} />
    </div>
  );
}
