import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 lg:px-6">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Sign in</p>
          <h1 className="text-4xl font-semibold text-stone-950">Step back into your CV workflow.</h1>
          <p className="text-sm text-stone-600">
            Continue from your latest CV analysis, role selection, interview practice, and job orchestration state.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
