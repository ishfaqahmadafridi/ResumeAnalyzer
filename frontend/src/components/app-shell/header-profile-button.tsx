"use client";

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
