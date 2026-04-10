"use client";

import { useSyncAuth } from "@/features/hooks/auth/use-sync-auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  useSyncAuth();
  return <>{children}</>;
}
