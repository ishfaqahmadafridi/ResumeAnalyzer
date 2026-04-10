import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store";
import { useUIStore } from "@/store/ui-store";
import { getNextInterviewPrompt } from "@/features/utils/interview/workspace-calculations";
import type { UseInterviewWorkspaceResult, Message } from "@/features/types/interview/workspace";

export function useInterviewWorkspace(): UseInterviewWorkspaceResult {
  const cvs = useAppSelector((state: any) => state.cv.items);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
  const latestAnalysis = useAppSelector((state: any) => state.cv.latestRoleAnalysis);
  
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
      text: "Interview practice for your selected role starts here.",
    },
  ]);

  useEffect(() => {
    if (savedRole && savedRole !== activeInterviewRole) {
      setActiveInterviewRole(savedRole);
    }
  }, [activeInterviewRole, savedRole, setActiveInterviewRole]);

  function sendMessage() {
    if (!interviewDraft.trim()) return;
    const nextMessages: Message[] = [...messages, { role: "user", text: interviewDraft }];
    const nextPrompt = getNextInterviewPrompt(nextMessages.length);
    nextMessages.push({
      role: "assistant",
      text: `For the ${activeInterviewRole} role: ${nextPrompt}`,
    });
    setMessages(nextMessages);
    setInterviewDraft("");
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
