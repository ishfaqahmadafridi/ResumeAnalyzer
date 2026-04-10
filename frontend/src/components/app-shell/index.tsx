"use client";

import { MobileNavTrigger } from "./mobile-nav-trigger";
import { MobileOverlay } from "./mobile-overlay";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { WrapperProps } from "@/types/components";

export function AppShell({ children }: WrapperProps) {
  return (
    <div className="grain min-h-screen">
      <MobileNavTrigger />
      <MobileOverlay />
      
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] gap-6 px-4 py-6 lg:px-6">
        <Sidebar />
        
        <main className="min-w-0 flex-1 xl:pl-0">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
