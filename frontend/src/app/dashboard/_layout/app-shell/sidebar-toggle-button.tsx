import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function SidebarToggleButton() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <button
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-stone-700 transition-all duration-300 ease-out hover:bg-stone-100 hover:text-stone-900",
        !sidebarOpen && "xl:order-first xl:h-12 xl:w-12 xl:rounded-[18px]",
      )}
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {sidebarOpen ? (
        <ChevronsLeft className="h-5 w-5 transition-transform duration-300 ease-out" />
      ) : (
        <ChevronsRight className="h-5 w-5 transition-transform duration-300 ease-out" />
      )}
    </button>
  );
}
