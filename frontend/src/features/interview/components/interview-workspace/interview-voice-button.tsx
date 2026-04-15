import { Mic } from "lucide-react";

interface Props {
  onStartVoice: () => void;
  isListening: boolean;
}

export function InterviewVoiceButton({ onStartVoice, isListening }: Props) {
  return (
    <button 
      className={`rounded-[16px] border p-2.5 transition ${
        isListening ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-white/10 bg-white/10"
      }`}
      onClick={onStartVoice}
      type="button" 
      aria-label={isListening ? "Listening for voice input" : "Start voice input"}
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}
