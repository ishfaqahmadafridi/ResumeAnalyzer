import { InterviewMessageBubble } from "./interview-message-bubble";
import type { Message } from "@/features/types/interview/workspace";

export function InterviewMessageList({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map((message, index) => (
        <InterviewMessageBubble key={`${message.role}-${index}`} message={message} />
      ))}
    </>
  );
}
