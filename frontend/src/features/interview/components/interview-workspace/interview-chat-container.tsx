import { InterviewMessageScrollPanel } from "./interview-message-scroll-panel";
import { InterviewChatInputContainer } from "./interview-chat-input-container";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewChatContainer(props: UseInterviewWorkspaceResult) {
  return (
    <div className="rounded-[34px] border border-black/10 bg-[#0f0d0d] p-5 text-stone-50 shadow-[0_22px_45px_rgba(17,17,17,0.12)]">
      <InterviewMessageScrollPanel messages={props.messages} />
      <InterviewChatInputContainer {...props} />
    </div>
  );
}
