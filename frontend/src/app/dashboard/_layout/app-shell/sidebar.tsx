import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <aside
      className={cn(
        "fixed inset-y-4 left-4 z-40 flex overflow-hidden rounded-[28px] border border-black/10 bg-white/88 p-5 shadow-[var(--shadow)] backdrop-blur-xl transform-gpu transition-[transform,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:sticky xl:top-6 xl:z-auto xl:h-[calc(100vh-3rem)] xl:flex-col",
        sidebarOpen
          ? "translate-x-0 w-[290px] xl:w-[280px]"
          : "-translate-x-[120%] w-[290px] pointer-events-none xl:pointer-events-auto xl:translate-x-0 xl:w-[92px]",
      )}
    >
      <SidebarHeader />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
