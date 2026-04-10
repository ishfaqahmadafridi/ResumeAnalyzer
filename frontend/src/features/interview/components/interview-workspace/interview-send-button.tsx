import { Send } from "lucide-react";

export function InterviewSendButton({ sendMessage }: { sendMessage: () => void }) {
  return (
    <button 
      className="rounded-[16px] bg-amber-500 p-2.5 text-stone-950 transition hover:bg-amber-400" 
      onClick={sendMessage} 
      type="button" 
      aria-label="Send answer"
    >
      <Send className="h-5 w-5" />
    </button>
  );
}
