"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CircleHelp, Search } from "lucide-react";
import { useAppSelector } from "@/store";
import { useNotificationStore } from "@/store/notification-store";

export const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Career workspace", title: "Track your CV activity and hiring progress" },
  "/dashboard/cv": { eyebrow: "CV analysis", title: "Upload, compare, and improve every CV version" },
  "/dashboard/cv-history": { eyebrow: "CV history", title: "Review older uploads and reopen saved resume versions" },
  "/dashboard/interview": { eyebrow: "Interview prep", title: "Practice role-specific questions from your latest profile" },
  "/dashboard/jobs": { eyebrow: "Auto apply", title: "Manage platform links and launch your application flow" },
  "/dashboard/profile": { eyebrow: "Account settings", title: "Manage your profile, photo, and security details" },
};

export function Header() {
  const pathname = usePathname();
  const user = useAppSelector((state: any) => state.auth.user);
  const { notifications, markAsRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentMeta = pageMeta[pathname] ?? {
    eyebrow: "CV analysis platform",
    title: "Manage your documents, role fit, and application workflow",
  };
  
  const displayName = user?.first_name || user?.username || "Profile";
  const initials = (user?.first_name || user?.username || "U").slice(0, 1).toUpperCase();

  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white/84 px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{currentMeta.eyebrow}</p>
        <p className="mt-2 text-base font-semibold text-stone-950 sm:text-lg">{currentMeta.title}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
          aria-label="Search"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
          aria-label="Help"
          title="Help"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
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
      </div>
    </header>
  );
}
