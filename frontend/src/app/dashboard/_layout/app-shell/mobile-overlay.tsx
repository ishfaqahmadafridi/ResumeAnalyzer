import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function MobileOverlay() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 bg-stone-950/28 backdrop-blur-[2px] transition xl:hidden",
        sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={() => setSidebarOpen(false)}
    />
  );
}
