import type { AuthMode } from "@/features/types/auth";

interface AuthButtonProps {
  isPending: boolean;
  mode: AuthMode;
}

export function AuthButton({ isPending, mode }: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800 disabled:opacity-60"
    >
      {isPending ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
    </button>
  );
}
