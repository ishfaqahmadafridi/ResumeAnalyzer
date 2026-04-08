"use client";

import { create } from "zustand";

type UIState = {
  sidebarOpen: boolean;
  activeInterviewRole: string;
  interviewDraft: string;
  setSidebarOpen: (value: boolean) => void;
  setActiveInterviewRole: (value: string) => void;
  setInterviewDraft: (value: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeInterviewRole: "Frontend Developer",
  interviewDraft: "",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveInterviewRole: (activeInterviewRole) => set({ activeInterviewRole }),
  setInterviewDraft: (interviewDraft) => set({ interviewDraft }),
}));
