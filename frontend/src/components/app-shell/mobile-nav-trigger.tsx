"use client";

import { PanelLeft } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function MobileNavTrigger() {
  const sidebarOpen = useUIStore((state: any) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state: any) => state.setSidebarOpen);

  return (
    <button
      className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/88 text-stone-700 shadow-[var(--shadow)] backdrop-blur xl:hidden"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}
