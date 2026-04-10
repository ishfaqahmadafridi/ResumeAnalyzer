import { Mic } from "lucide-react";

export function InterviewVoiceButton() {
  return (
    <button 
      className="rounded-[16px] border border-white/10 bg-white/10 p-2.5" 
      type="button" 
      aria-label="Voice input placeholder"
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}
