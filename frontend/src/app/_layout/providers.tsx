"use client";

import { Toaster } from "sonner";
import { StoreProvider } from "@/store/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <Toaster richColors position="top-right" />
    </StoreProvider>
  );
}
