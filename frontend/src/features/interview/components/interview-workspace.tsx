"use client";

import { useEffect, useMemo, useState } from "react";
import { Mic, Send } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { useAppSelector } from "@/store";
import { useUIStore } from "@/store/ui-store";

type Message = {
  role: "assistant" | "user";
  text: string;
};

const defaultPrompts = [
  "Tell me about a project where you improved a user-facing metric.",
  "What gaps in your current CV are you actively closing for this role?",
  "How would you explain your strongest technical decision to a hiring manager?",
];

export function InterviewWorkspace() {
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const latestAnalysis = useAppSelector((state) => state.cv.latestRoleAnalysis);
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
    const nextPrompt = defaultPrompts[nextMessages.length % defaultPrompts.length];
    nextMessages.push({
      role: "assistant",
      text: `For the ${activeInterviewRole} role: ${nextPrompt}`,
    });
    setMessages(nextMessages);
    setInterviewDraft("");
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Interview Practice" description="Role-aware mock interview space wired to your latest CV analysis.">
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-base font-semibold text-stone-950">Role</p>
              <p className="mt-2 text-sm font-medium text-stone-700">{activeInterviewRole || "No role selected yet"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-stone-950">CV context loaded</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {latestAnalysis?.analysis
                  ? `The chatbot will interview you for your "${activeInterviewRole}" role. Current strengths: ${latestAnalysis.analysis.matched_skills.slice(0, 4).join(", ") || "not available"}`
                  : "Upload and analyze a CV so the interview prompt can be grounded in your real profile."}
              </p>
            </div>
          </div>

          <div className="rounded-[34px] border border-black/10 bg-[#0f0d0d] p-5 text-stone-50 shadow-[0_22px_45px_rgba(17,17,17,0.12)]">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 ${
                    message.role === "assistant" ? "bg-white/10 text-stone-100" : "ml-auto bg-emerald-600 text-emerald-50"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[24px] border border-white/10 bg-white/8 p-3">
              <div className="flex items-end gap-3">
                <textarea
                  rows={3}
                  value={interviewDraft}
                  onChange={(event) => setInterviewDraft(event.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[108px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none"
                />
                <div className="flex items-center gap-2 pb-1">
                  <button className="rounded-[16px] border border-white/10 bg-white/10 p-2.5" type="button" aria-label="Voice input placeholder">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button className="rounded-[16px] bg-amber-500 p-2.5 text-stone-950" onClick={sendMessage} type="button" aria-label="Send answer">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
