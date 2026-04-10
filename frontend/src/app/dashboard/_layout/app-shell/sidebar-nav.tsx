import { cn } from "@/lib/utils";
import { navItems } from "@/utils/constants";
import { useUIStore } from "@/store/ui-store";
import { SidebarNavItem } from "./sidebar-nav-item";

export function SidebarNav() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <nav className={cn("space-y-2", !sidebarOpen && "xl:flex-1 xl:space-y-3")}>
      {navItems.map((item) => (
        <SidebarNavItem key={item.href} item={item} />
      ))}
    </nav>
  );
}
