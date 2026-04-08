"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { StoreProvider } from "@/store/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <StoreProvider>
        {children}
        <Toaster richColors position="top-right" />
      </StoreProvider>
    </ThemeProvider>
  );
}
