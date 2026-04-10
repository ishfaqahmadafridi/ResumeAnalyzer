"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { parseJson } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuth, setAuth } from "@/store/auth-slice";
import type { AuthResponse } from "@/types";
import type { WrapperProps } from "@/types/components";

const PUBLIC_ROUTES = new Set(["/", "/auth/login", "/auth/register"]);

<<<<<<<< HEAD:frontend/src/features/hooks/auth/use-sync-auth.ts
export function useSyncAuth() {
========
export function AuthGate({ children }: WrapperProps) {
>>>>>>>> origin/main:frontend/src/store/auth-gate.tsx
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const saved = parseJson<AuthResponse | null>(localStorage.getItem("cvforge-auth"), null);
    if (saved?.token && saved?.user && !token) {
      dispatch(setAuth({ token: saved.token, user: saved.user }));
      void api
        .me(saved.token)
        .then((user) => {
          const nextAuth = { token: saved.token, user };
          localStorage.setItem("cvforge-auth", JSON.stringify(nextAuth));
          dispatch(setAuth(nextAuth));
        })
        .catch(() => {
          localStorage.removeItem("cvforge-auth");
          dispatch(clearAuth());
          if (!PUBLIC_ROUTES.has(pathname)) {
            router.replace("/auth/login");
          }
        });
      return;
    }

    if (!saved?.token && !PUBLIC_ROUTES.has(pathname)) {
      router.replace("/auth/login");
    }
  }, [dispatch, pathname, router, token]);
}
