interface Props {
  interviewDraft: string;
  setInterviewDraft: (draft: string) => void;
}

export function InterviewChatTextarea({ interviewDraft, setInterviewDraft }: Props) {
  return (
    <textarea
      rows={3}
      value={interviewDraft}
      onChange={(event) => setInterviewDraft(event.target.value)}
      placeholder="Type your answer here..."
      className="min-h-[108px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none"
    />
  );
}
