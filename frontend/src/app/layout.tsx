import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { AuthGate } from "@/components/auth-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVForge AI",
  description: "AI-powered CV analysis, interview practice, and job workflow cockpit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthGate>{children}</AuthGate>
        </Providers>
      </body>
    </html>
  );
}
