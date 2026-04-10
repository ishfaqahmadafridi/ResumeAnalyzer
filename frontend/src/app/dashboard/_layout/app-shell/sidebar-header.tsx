import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { SidebarToggleButton } from "./sidebar-toggle-button";

export function SidebarHeader() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div
      className={cn(
        "mb-8 flex items-start justify-between gap-4",
        !sidebarOpen && "xl:mb-6 xl:flex-col xl:items-center xl:gap-4",
      )}
    >
      {sidebarOpen ? (
        <div className="min-w-0 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-stone-500">CV Analysis Hub</p>
        </div>
      ) : (
        <div className="hidden xl:block" />
      )}
      <SidebarToggleButton />
    </div>
  );
}
