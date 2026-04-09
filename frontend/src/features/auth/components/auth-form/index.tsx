"use client";

import { useAuthForm } from "@/features/hooks/auth/use-auth-form";
import { AuthFormHeader } from "./auth-form-header";
import { AuthNameFields } from "./auth-name-fields";
import { AuthUsernameField } from "./auth-username-field";
import { AuthEmailField } from "./auth-email-field";
import { AuthPasswordField } from "./auth-password-field";
import { AuthButton } from "./auth-button";
import { AuthRedirect } from "./auth-redirect";
import type { AuthFormProps } from "@/features/types/auth";

export function AuthForm({ mode }: AuthFormProps) {
  const { form, setForm, isPending, handleSubmit } = useAuthForm(mode);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[var(--shadow)]">
      <AuthFormHeader mode={mode} />
      <AuthNameFields mode={mode} form={form} setForm={setForm} />
      <AuthUsernameField form={form} setForm={setForm} />
      <AuthEmailField form={form} setForm={setForm} />
      <AuthPasswordField form={form} setForm={setForm} />
      <AuthButton isPending={isPending} mode={mode} />
      <AuthRedirect mode={mode} />
    </form>
  );
}
