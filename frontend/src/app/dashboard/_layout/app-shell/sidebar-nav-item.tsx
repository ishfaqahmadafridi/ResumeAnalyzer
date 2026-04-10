import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import type { NavItemType } from "@/types/components";

export function SidebarNavItem({ item }: { item: NavItemType }) {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const Icon = item.icon;
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
        active
          ? "bg-emerald-700/90 text-emerald-50 shadow-sm"
          : "text-stone-700 hover:bg-stone-900/5 hover:text-stone-950",
        !sidebarOpen && "xl:h-12 xl:justify-center xl:px-0",
      )}
      aria-label={item.label}
      title={item.label}
    >
      <Icon className="h-5 w-5" />
      {sidebarOpen ? item.label : null}
    </Link>
  );
}
