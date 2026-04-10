export interface Message {
  role: "assistant" | "user";
  text: string;
}

export interface UseInterviewWorkspaceResult {
  activeInterviewRole: string | null;
  latestAnalysis: any | null;
  messages: Message[];
  interviewDraft: string;
  setInterviewDraft: (draft: string) => void;
  sendMessage: () => void;
}
