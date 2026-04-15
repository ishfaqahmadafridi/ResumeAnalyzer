import { create } from "zustand";
import type { VoicePhase } from "@/features/types/interview/voice";

type InterviewVoiceState = {
  phase: VoicePhase;
  micVerified: boolean;
  setPhase: (phase: VoicePhase) => void;
  setMicVerified: (value: boolean) => void;
  resetVoiceState: () => void;
};

export const useInterviewVoiceStore = create<InterviewVoiceState>((set) => ({
  phase: "idle",
  micVerified: false,
  setPhase: (phase) => set({ phase }),
  setMicVerified: (micVerified) => set({ micVerified }),
  resetVoiceState: () => set({ phase: "idle", micVerified: false }),
}));
