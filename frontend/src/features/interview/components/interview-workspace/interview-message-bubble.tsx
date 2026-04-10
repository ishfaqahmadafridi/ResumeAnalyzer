import type { Message } from "@/features/types/interview/workspace";

export function InterviewMessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";
  const bubbleClasses = isAssistant 
    ? "bg-white/10 text-stone-100" 
    : "ml-auto bg-emerald-600 text-emerald-50";

  return (
    <div className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 ${bubbleClasses}`}>
      {message.text}
    </div>
  );
}
