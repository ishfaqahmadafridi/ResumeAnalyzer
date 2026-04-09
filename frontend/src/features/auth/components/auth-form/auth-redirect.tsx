import Link from "next/link";
import type { AuthMode } from "@/features/types/auth";

export function AuthRedirect({ mode }: { mode: AuthMode }) {
  return (
    <p className="text-sm text-stone-600">
      {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
      <Link className="font-semibold text-emerald-800" href={mode === "register" ? "/auth/login" : "/auth/register"}>
        {mode === "register" ? "Sign in" : "Register"}
      </Link>
    </p>
  );
}
