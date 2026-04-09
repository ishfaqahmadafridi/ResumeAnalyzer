import { api } from "@/lib/api";
import type { AuthFormData, AuthMode } from "@/features/types/auth";

export async function submitAuthData(mode: AuthMode, form: AuthFormData) {
  if (mode === "register") {
    return api.register(form);
  }
  return api.login({ username: form.username, email: form.email, password: form.password });
}
