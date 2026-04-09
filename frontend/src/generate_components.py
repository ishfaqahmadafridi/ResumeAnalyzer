import os

base_dir = "C:/Users/DELL/Desktop/langGrapgh/frontend/src"
components_dir = os.path.join(base_dir, "components", "app-shell")
utils_dir = os.path.join(base_dir, "utils")

os.makedirs(components_dir, exist_ok=True)
os.makedirs(utils_dir, exist_ok=True)

constants_content = """import {
  BriefcaseBusiness,
  FileClock,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cv", label: "CV Analysis", icon: FileText },
  { href: "/dashboard/cv-history", label: "CV History", icon: FileClock },
  { href: "/dashboard/interview", label: "Interview", icon: MessageSquareQuote },
  { href: "/dashboard/jobs", label: "Auto Apply", icon: BriefcaseBusiness },
];

export const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Career workspace", title: "Track your CV activity and hiring progress" },
  "/dashboard/cv": { eyebrow: "CV analysis", title: "Upload, compare, and improve every CV version" },
  "/dashboard/cv-history": { eyebrow: "CV history", title: "Review older uploads and reopen saved resume versions" },
  "/dashboard/interview": { eyebrow: "Interview prep", title: "Practice role-specific questions from your latest profile" },
  "/dashboard/jobs": { eyebrow: "Auto apply", title: "Manage platform links and launch your application flow" },
  "/dashboard/profile": { eyebrow: "Account settings", title: "Manage your profile, photo, and security details" },
};
"""

files = {
    os.path.join(utils_dir, "constants.ts"): constants_content,
    os.path.join(components_dir, "mobile-nav-trigger.tsx"): """import { PanelLeft } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function MobileNavTrigger() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

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
""",
    os.path.join(components_dir, "mobile-overlay.tsx"): """import { cn } from "@/lib/utils";
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
""",
    os.path.join(components_dir, "sidebar-header.tsx"): """import { cn } from "@/lib/utils";
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
          <p className="mt-2 text-sm font-medium text-stone-700">Upload, review, and improve every CV version.</p>
        </div>
      ) : (
        <div className="hidden xl:block" />
      )}
      <SidebarToggleButton />
    </div>
  );
}
""",
    os.path.join(components_dir, "sidebar-toggle-button.tsx"): """import { ChevronLeft, ChevronRight } from "lucide-react";
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
""",
    os.path.join(components_dir, "sidebar-nav-item.tsx"): """import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function SidebarNavItem({ item }: { item: { href: string; label: string; icon: React.ElementType } }) {
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
          ? "bg-emerald-900 text-emerald-50"
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
""",
    os.path.join(components_dir, "sidebar-nav.tsx"): """import { cn } from "@/lib/utils";
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
""",
    os.path.join(components_dir, "sidebar-user.tsx"): """"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuth } from "@/store/auth-slice";
import { useHydrated } from "@/hooks/use-hydrated";

export function SidebarUser() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();
  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  function logout() {
    localStorage.removeItem("cvforge-auth");
    dispatch(clearAuth());
    toast.success("Signed out");
    router.push("/auth/login");
  }

  if (!hydrated || !user) return null;

  return (
    <div
      className={cn(
        "mt-auto rounded-2xl border border-black/10 bg-stone-950 px-4 py-4 text-stone-100",
        !sidebarOpen && "xl:mt-auto xl:flex xl:flex-col xl:items-center xl:gap-2 xl:rounded-[28px] xl:px-2 xl:py-3",
      )}
    >
      {sidebarOpen ? (
        <>
          <p className="text-sm font-semibold">{user.first_name || user.username}</p>
          <p className="mt-1 break-all text-xs text-stone-400">{user.email}</p>
        </>
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xs font-semibold uppercase text-white">
          {(user.first_name || user.username || "U").slice(0, 1)}
        </div>
      )}
      <button
        onClick={logout}
        className={cn(
          "mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold",
          !sidebarOpen &&
            "xl:mt-0 xl:h-11 xl:w-11 xl:justify-center xl:rounded-2xl xl:border xl:border-white/10 xl:bg-white/6 xl:px-0 xl:hover:bg-white/12",
        )}
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
        {sidebarOpen ? "Sign out" : null}
      </button>
    </div>
  );
}
""",
    os.path.join(components_dir, "sidebar.tsx"): """import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <aside
      className={cn(
        "fixed inset-y-4 left-4 z-40 flex overflow-hidden rounded-[28px] border border-black/10 bg-white/88 p-5 shadow-[var(--shadow)] backdrop-blur-xl transition-all duration-300 xl:sticky xl:top-6 xl:z-auto xl:h-[calc(100vh-3rem)] xl:flex-col",
        sidebarOpen
          ? "translate-x-0 w-[290px] xl:w-[280px]"
          : "-translate-x-[120%] w-[290px] xl:translate-x-0 xl:w-[92px]",
      )}
    >
      <SidebarHeader />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
""",
    os.path.join(components_dir, "header-title.tsx"): """import { usePathname } from "next/navigation";
import { pageMeta } from "@/utils/constants";

export function HeaderTitle() {
  const pathname = usePathname();
  const currentMeta = pageMeta[pathname] ?? {
    eyebrow: "CV analysis platform",
    title: "Manage your documents, role fit, and application workflow",
  };

  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{currentMeta.eyebrow}</p>
      <p className="mt-2 text-base font-semibold text-stone-950 sm:text-lg">{currentMeta.title}</p>
    </div>
  );
}
""",
    os.path.join(components_dir, "header-search-button.tsx"): """import { Search } from "lucide-react";

export function HeaderSearchButton() {
  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
      aria-label="Search"
      title="Search"
    >
      <Search className="h-4 w-4" />
    </button>
  );
}
""",
    os.path.join(components_dir, "header-help-button.tsx"): """import { CircleHelp } from "lucide-react";

export function HeaderHelpButton() {
  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
      aria-label="Help"
      title="Help"
    >
      <CircleHelp className="h-4 w-4" />
    </button>
  );
}
""",
    os.path.join(components_dir, "header-notification-button.tsx"): """import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";

export function HeaderNotificationButton() {
  const { notifications, markAsRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Link
      href="/dashboard/notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
      aria-label="Notifications"
      title="Notifications"
      onClick={markAsRead}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </Link>
  );
}
""",
    os.path.join(components_dir, "header-profile-button.tsx"): """"use client";

import Link from "next/link";
import { useAppSelector } from "@/store";

export function HeaderProfileButton() {
  const user = useAppSelector((state) => state.auth.user);
  
  const displayName = user?.first_name || user?.username || "Profile";
  const initials = (user?.first_name || user?.username || "U").slice(0, 1).toUpperCase();

  return (
    <Link
      href="/dashboard/profile"
      className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-2.5 py-1.5 text-stone-900 transition hover:bg-stone-50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#34d399,#22c55e)] text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="hidden text-left sm:block">
        <p className="text-sm font-semibold">{displayName}</p>
        <p className="text-xs text-stone-500">{user?.email || "Account"}</p>
      </div>
    </Link>
  );
}
""",
    os.path.join(components_dir, "header-actions.tsx"): """import { HeaderSearchButton } from "./header-search-button";
import { HeaderHelpButton } from "./header-help-button";
import { HeaderNotificationButton } from "./header-notification-button";
import { HeaderProfileButton } from "./header-profile-button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <HeaderSearchButton />
      <HeaderHelpButton />
      <HeaderNotificationButton />
      <HeaderProfileButton />
    </div>
  );
}
""",
    os.path.join(components_dir, "header.tsx"): """import { HeaderTitle } from "./header-title";
import { HeaderActions } from "./header-actions";

export function Header() {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white/84 px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <HeaderTitle />
      <HeaderActions />
    </header>
  );
}
""",
    os.path.join(base_dir, "components", "app-shell.tsx"): """"use client";

import { MobileNavTrigger } from "./app-shell/mobile-nav-trigger";
import { MobileOverlay } from "./app-shell/mobile-overlay";
import { Sidebar } from "./app-shell/sidebar";
import { Header } from "./app-shell/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain min-h-screen">
      <MobileNavTrigger />
      <MobileOverlay />
      
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] gap-6 px-4 py-6 lg:px-6">
        <Sidebar />
        
        <main className="min-w-0 flex-1 xl:pl-0">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
"""
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(files)} files successfully.")
