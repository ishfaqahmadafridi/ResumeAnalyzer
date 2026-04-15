import type { CVRoleAnalysis } from "@/types";

export interface Message {
  role: "assistant" | "user";
  text: string;
}

export interface UseInterviewWorkspaceResult {
  activeInterviewRole: string | null;
  latestAnalysis: CVRoleAnalysis | null;
  messages: Message[];
  interviewDraft: string;
  setInterviewDraft: (draft: string) => void;
  sendMessage: (inputText?: string) => Promise<string | null>;
  pushAssistantMessage: (text: string) => void;
}
