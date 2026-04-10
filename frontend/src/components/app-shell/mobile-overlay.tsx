"use client";

import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function MobileOverlay() {
  const sidebarOpen = useUIStore((state: any) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state: any) => state.setSidebarOpen);

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 bg-stone-950/28 backdrop-blur-[2px] transition xl:hidden",
        sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={() => setSidebarOpen(false)}
    />
  );
}
