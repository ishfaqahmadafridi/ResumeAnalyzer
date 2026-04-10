import type { Metadata } from "next";
import { RootBody } from "./_layout/root-body";
import "./globals.css";

export const metadata: Metadata = {
  title: "CVForge AI",
  description: "AI-powered CV analysis, interview practice, and job workflow cockpit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootBody>{children}</RootBody>;
}
