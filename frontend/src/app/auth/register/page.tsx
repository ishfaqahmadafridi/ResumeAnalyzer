import { AuthForm } from "@/features/auth/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 lg:px-6">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Create account</p>
          <h1 className="text-4xl font-semibold text-stone-950">Start the full CVForge AI flow.</h1>
          <p className="text-sm text-stone-600">
            Set up your account first, then upload a CV, select a role, and move into interview and job workflow screens.
          </p>
        </div>
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
