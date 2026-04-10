import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function MobileNavTrigger() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <button
      className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/88 text-stone-700 shadow-[var(--shadow)] backdrop-blur transition-all duration-300 ease-out hover:bg-white xl:hidden"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {sidebarOpen ? (
        <ChevronsLeft className="h-5 w-5 transition-transform duration-300 ease-out" />
      ) : (
        <ChevronsRight className="h-5 w-5 transition-transform duration-300 ease-out" />
      )}
    </button>
  );
}
