import type { AuthMode } from "@/features/types/auth";

export function AuthFormHeader({ mode }: { mode: AuthMode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
        {mode === "register" ? "Create your workspace" : "Sign in to continue"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-stone-950">
        {mode === "register" ? "Build your AI job cockpit" : "Return to your dashboard"}
      </h1>
    </div>
  );
}
