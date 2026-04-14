import { StoreProvider } from "@/store/providers";
import { AppToaster } from "@/components/ui/app-toaster";
import { AuthGate } from "./auth-gate";

export function RootBody({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <AuthGate>{children}</AuthGate>
          <AppToaster />
        </StoreProvider>
      </body>
    </html>
  );
}