import type { KeyboardEvent } from "react";
import { applyEnterSubmitShortcut } from "@/features/utils/interview/keyboard";

interface Props {
  interviewDraft: string;
  setInterviewDraft: (draft: string) => void;
  onSubmit: () => void;
}

export function InterviewChatTextarea({ interviewDraft, setInterviewDraft, onSubmit }: Props) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    applyEnterSubmitShortcut(event, onSubmit);
  };

  return (
    <textarea
      rows={3}
      value={interviewDraft}
      onChange={(event) => setInterviewDraft(event.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your answer here..."
      className="min-h-27 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none"
    />
  );
}
