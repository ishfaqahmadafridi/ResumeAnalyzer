import { AuthInput } from "./auth-input";
import type { AuthFormData } from "@/features/types/auth";

interface AuthNameFieldsProps {
  mode: string;
  form: AuthFormData;
  setForm: React.Dispatch<React.SetStateAction<AuthFormData>>;
}

export function AuthNameFields({ mode, form, setForm }: AuthNameFieldsProps) {
  if (mode !== "register") return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AuthInput
        label="First name"
        value={form.first_name}
        onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
      />
      <AuthInput
        label="Last name"
        value={form.last_name}
        onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
      />
    </div>
  );
}
