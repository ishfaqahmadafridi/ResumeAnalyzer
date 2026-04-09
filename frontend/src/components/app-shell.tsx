"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BriefcaseBusiness, FileClock, FileText, LayoutDashboard, LogOut, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuth } from "@/store/auth-slice";
import { useHydrated } from "@/hooks/use-hydrated";
import { useUIStore } from "@/store/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cv", label: "CV Analysis", icon: FileText },
  { href: "/dashboard/cv-history", label: "CV History", icon: FileClock },
  { href: "/dashboard/interview", label: "Interview", icon: MessageSquareQuote },
  { href: "/dashboard/jobs", label: "Auto Apply", icon: BriefcaseBusiness },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();
  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  function logout() {
    localStorage.removeItem("cvforge-auth");
    dispatch(clearAuth());
    toast.success("Signed out");
    router.push("/auth/login");
  }

  return (
    <div className="grain min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside
          className={cn(
            "rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[var(--shadow)] backdrop-blur-xl transition-all duration-300",
            sidebarOpen ? "w-[270px]" : "w-[88px]",
          )}
        >
          <button
            className="mb-8 inline-flex rounded-full border border-black/10 px-3 py-2 text-sm font-semibold"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Collapse" : "Menu"}
          </button>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">CVForge AI</p>
            {sidebarOpen ? (
              <>
                <h1 className="mt-2 text-2xl font-semibold text-stone-900">Career cockpit</h1>
                <p className="mt-2 text-sm text-stone-600">
                  One place to refine your CV, rehearse interviews, and launch job applications.
                </p>
              </>
            ) : null}
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                    active
                      ? "bg-emerald-900 text-emerald-50"
                      : "text-stone-700 hover:bg-stone-900/5 hover:text-stone-950",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen ? item.label : null}
                </Link>
              );
            })}
          </nav>
          {hydrated && user ? (
            <div className="mt-8 rounded-2xl border border-black/10 bg-stone-950 px-4 py-4 text-stone-100">
              {sidebarOpen ? (
                <>
                  <p className="text-sm font-semibold">{user.first_name || user.username}</p>
                  <p className="text-xs text-stone-400">{user.email}</p>
                </>
              ) : null}
              <button
                onClick={logout}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold"
              >
                <LogOut className="h-4 w-4" />
                {sidebarOpen ? "Sign out" : null}
              </button>
            </div>
          ) : null}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
