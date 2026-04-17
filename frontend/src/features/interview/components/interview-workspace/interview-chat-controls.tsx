import { InterviewVoiceButton } from "./interview-voice-button";
import { InterviewSendButton } from "./interview-send-button";
import { useInterviewVoiceAssistant } from "@/features/hooks/interview/use-interview-voice-assistant";
import type { UseInterviewWorkspaceResult } from "@/features/types/interview/workspace";

export function InterviewChatControls(props: UseInterviewWorkspaceResult) {
  const { isListening, startVoiceFlow } = useInterviewVoiceAssistant({
    sendMessage: props.sendMessage,
    setInterviewDraft: props.setInterviewDraft,
    pushAssistantMessage: props.pushAssistantMessage,
  });

  return (
    <div className="flex items-center gap-2 pb-1">
      <InterviewVoiceButton onStartVoice={startVoiceFlow} isListening={isListening} />
      <InterviewSendButton sendMessage={() => props.sendMessage()} />
    </div>
  );
}
