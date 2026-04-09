import type { Metadata } from "next";
import { Providers } from "@/store/providers";
import { AuthGate } from "@/store/auth-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVForge AI",
  description: "AI-powered CV analysis, interview practice, and job workflow cockpit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthGate>{children}</AuthGate>
        </Providers>
      </body>
    </html>
  );
}
