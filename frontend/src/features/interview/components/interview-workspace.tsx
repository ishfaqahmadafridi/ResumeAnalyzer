"use client";

import { useMemo, useState } from "react";
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
  const latestAnalysis = useAppSelector((state) => state.cv.latestRoleAnalysis);
  const activeInterviewRole = useUIStore((state) => state.activeInterviewRole);
  const setActiveInterviewRole = useUIStore((state) => state.setActiveInterviewRole);
  const interviewDraft = useUIStore((state) => state.interviewDraft);
  const setInterviewDraft = useUIStore((state) => state.setInterviewDraft);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I’ll act as your interviewer. Pick a role, then answer naturally and I’ll keep the session moving.",
    },
  ]);

  const roleOptions = useMemo(
    () => latestAnalysis?.recommended_roles?.map((item) => item.role) ?? ["Frontend Developer", "Backend Developer", "AI Engineer"],
    [latestAnalysis],
  );

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
    <div className="space-y-6">
      <SectionCard title="Interview Practice" description="Role-aware mock interview space wired to your latest CV analysis.">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-stone-900">Role</p>
              <div className="mt-3 space-y-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveInterviewRole(role)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${activeInterviewRole === role ? "border-emerald-700 bg-emerald-50" : "border-black/10 bg-stone-50"}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">CV context loaded</p>
              <p className="mt-2 text-sm text-stone-600">
                {latestAnalysis?.analysis
                  ? `Current strengths: ${latestAnalysis.analysis.matched_skills.slice(0, 4).join(", ") || "not available"}`
                  : "Upload and analyze a CV so the interview prompt can be grounded in your real profile."}
              </p>
            </div>
          </div>

          <div className="rounded-[26px] border border-black/10 bg-stone-950 p-4 text-stone-50">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "assistant" ? "bg-white/10 text-stone-100" : "ml-auto bg-emerald-600 text-emerald-50"}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end gap-3">
              <textarea
                rows={3}
                value={interviewDraft}
                onChange={(event) => setInterviewDraft(event.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[88px] flex-1 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none"
              />
              <div className="flex flex-col gap-2">
                <button className="rounded-2xl border border-white/10 bg-white/10 p-3" type="button" aria-label="Voice input placeholder">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="rounded-2xl bg-amber-500 p-3 text-stone-950" onClick={sendMessage} type="button" aria-label="Send answer">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
