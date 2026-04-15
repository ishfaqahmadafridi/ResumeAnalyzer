import { InterviewChatTextarea } from "./interview-chat-textarea";
import { InterviewChatControls } from "./interview-chat-controls";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewChatInputWrapper(props: UseInterviewWorkspaceResult) {
  return (
    <div className="flex items-end gap-3">
      <InterviewChatTextarea 
        interviewDraft={props.interviewDraft} 
        setInterviewDraft={props.setInterviewDraft} 
        onSubmit={() => {
          void props.sendMessage();
        }}
      />
      <InterviewChatControls {...props} />
    </div>
  );
}
