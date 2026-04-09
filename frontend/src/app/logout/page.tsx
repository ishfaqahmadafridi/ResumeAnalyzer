"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("cvforge-auth");
    router.replace("/auth/login");
  }, [router]);

  return <div className="mx-auto max-w-2xl px-4 py-16 text-sm text-stone-600">Signing you out...</div>;
}
