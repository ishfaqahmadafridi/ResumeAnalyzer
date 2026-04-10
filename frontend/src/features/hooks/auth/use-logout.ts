"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store";
import { clearAuth } from "@/store/auth-slice";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return () => {
    localStorage.removeItem("cvforge-auth");
    dispatch(clearAuth());
    toast.success("Signed out");
    router.push("/auth/login");
  };
}
