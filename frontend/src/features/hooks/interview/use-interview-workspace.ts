import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAppSelector } from "@/store";
import { useUIStore } from "@/store/ui-store";
import {
  isLikelyUnsupportedInterviewLanguage,
  unsupportedLanguageInterviewMessage,
} from "@/features/utils/interview/language";
import type { CVRoleAnalysis } from "@/types";
import type { UseInterviewWorkspaceResult, Message } from "@/features/types/interview/workspace";

type InterviewOrchestratorResponse = {
  thread_id?: string;
  interview_reply?: string;
  interview_role?: string;
};

export function useInterviewWorkspace(): UseInterviewWorkspaceResult {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const latestAnalysis = useAppSelector((state) => state.cv.latestRoleAnalysis as CVRoleAnalysis | null);

  const activeInterviewRole = useUIStore((state) => state.activeInterviewRole);
  const setActiveInterviewRole = useUIStore((state) => state.setActiveInterviewRole);
  const interviewDraft = useUIStore((state) => state.interviewDraft);
  const setInterviewDraft = useUIStore((state) => state.setInterviewDraft);

  const activeCv = useMemo(
    () => cvs.find((cv) => cv.id === selectedCvId) ?? cvs[0] ?? null,
    [cvs, selectedCvId],
  );

  const savedRole = latestAnalysis?.analysis?.role ?? activeCv?.recommended_roles?.[0]?.title ?? null;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I am HireFlow AI. Type start interview when you are ready.",
    },
  ]);
  const messagesRef = useRef<Message[]>(messages);
  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (savedRole && savedRole !== activeInterviewRole) {
      setActiveInterviewRole(savedRole);
    }
  }, [activeInterviewRole, savedRole, setActiveInterviewRole]);

  const pushAssistantMessage = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      return;
    }
    setMessages((current) => {
      const lastMessage = current[current.length - 1];
      if (lastMessage?.role === "assistant" && lastMessage.text === cleaned) {
        return current;
      }
      const nextMessages: Message[] = [...current, { role: "assistant" as const, text: cleaned }];
      messagesRef.current = nextMessages;
      return nextMessages;
    });
  }, []);

  const sendMessage = useCallback(async (inputText?: string): Promise<string | null> => {
    const userText = (inputText ?? interviewDraft).trim();
    if (!userText) return null;

    const nextMessages: Message[] = [...messagesRef.current, { role: "user", text: userText }];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setInterviewDraft("");

    if (isLikelyUnsupportedInterviewLanguage(userText)) {
      const text = unsupportedLanguageInterviewMessage();
      pushAssistantMessage(text);
      return text;
    }

    if (!token || !user?.id) {
      const text = "Please sign in first so I can run the interview with the model.";
      pushAssistantMessage(text);
      return text;
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

      const replyText = result.interview_reply || "Thank you. Please continue with more detail.";
      pushAssistantMessage(replyText);
      return replyText;
    } catch {
      const text = "I could not reach the interview model right now. Please try again in a moment.";
      pushAssistantMessage(text);
      return text;
    }
  }, [
    activeCv,
    activeInterviewRole,
    interviewDraft,
    pushAssistantMessage,
    savedRole,
    setActiveInterviewRole,
    setInterviewDraft,
    threadId,
    token,
    user,
  ]);

  return {
    activeInterviewRole,
    latestAnalysis,
    messages,
    interviewDraft,
    setInterviewDraft,
    sendMessage,
    pushAssistantMessage,
  };
}
