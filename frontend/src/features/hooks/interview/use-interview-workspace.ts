import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAppSelector } from "@/store";
import { useUIStore } from "@/store/ui-store";
import type { CVRoleAnalysis } from "@/types";
import type { UseInterviewWorkspaceResult, Message } from "@/features/types/interview/workspace";

type InterviewOrchestratorResponse = {
  thread_id?: string;
  interview_reply?: string;
  interview_role?: string;
};

export function useInterviewWorkspace(): UseInterviewWorkspaceResult {
  const token = useAppSelector((state: any) => state.auth.token as string | null);
  const user = useAppSelector((state: any) => state.auth.user as { id?: string } | null);
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
  const latestAnalysis = useAppSelector((state: any) => state.cv.latestRoleAnalysis as CVRoleAnalysis | null);

  const activeInterviewRole = useUIStore((state) => state.activeInterviewRole);
  const setActiveInterviewRole = useUIStore((state) => state.setActiveInterviewRole);
  const interviewDraft = useUIStore((state) => state.interviewDraft);
  const setInterviewDraft = useUIStore((state) => state.setInterviewDraft);

  const activeCv = useMemo(
    () => cvs.find((cv: any) => cv.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

  const savedRole = latestAnalysis?.analysis?.role ?? activeCv?.recommended_roles?.[0]?.title ?? null;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I am HireFlow AI. Type start interview when you are ready.",
    },
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (savedRole && savedRole !== activeInterviewRole) {
      setActiveInterviewRole(savedRole);
    }
  }, [activeInterviewRole, savedRole, setActiveInterviewRole]);

  async function sendMessage() {
    const userText = interviewDraft.trim();
    if (!userText) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(nextMessages);
    setInterviewDraft("");

    if (!token || !user?.id) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Please sign in first so I can run the interview with the model.",
        },
      ]);
      return;
    }

    try {
      const result = (await api.orchestrate(token, {
        user_id: String(user.id),
        cv_text: activeCv?.raw_text ?? "",
        action: "interview_turn",
        thread_id: threadId ?? undefined,
        action_data: {
          user_text: userText,
          role: activeInterviewRole ?? savedRole ?? "",
          history: nextMessages,
        },
      })) as InterviewOrchestratorResponse;

      if (result.thread_id && result.thread_id !== threadId) {
        setThreadId(result.thread_id);
      }

      if (result.interview_role && result.interview_role !== activeInterviewRole) {
        setActiveInterviewRole(result.interview_role);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: result.interview_reply || "Thank you. Please continue with more detail.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I could not reach the interview model right now. Please try again in a moment.",
        },
      ]);
    }
  }

  return {
    activeInterviewRole,
    latestAnalysis,
    messages,
    interviewDraft,
    setInterviewDraft,
    sendMessage,
  };
}
