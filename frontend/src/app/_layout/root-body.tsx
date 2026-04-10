import { StoreProvider } from "@/store/providers";
import { AuthGate } from "./auth-gate";

export function RootBody({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <AuthGate>{children}</AuthGate>
        </StoreProvider>
      </body>
    </html>
  );
}