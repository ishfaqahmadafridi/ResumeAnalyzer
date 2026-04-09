"use client";

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
