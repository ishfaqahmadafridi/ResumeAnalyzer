import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function SidebarToggleButton() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <button
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-stone-700 transition hover:bg-stone-100",
        !sidebarOpen && "xl:order-first xl:h-12 xl:w-12 xl:rounded-[18px]",
      )}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
