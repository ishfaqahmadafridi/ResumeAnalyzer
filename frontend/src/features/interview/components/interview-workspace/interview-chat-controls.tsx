import { InterviewVoiceButton } from "./interview-voice-button";
import { InterviewSendButton } from "./interview-send-button";

export function InterviewChatControls({ sendMessage }: { sendMessage: () => void }) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <InterviewVoiceButton />
      <InterviewSendButton sendMessage={sendMessage} />
    </div>
  );
}
