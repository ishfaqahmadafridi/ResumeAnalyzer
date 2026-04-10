import { AuthInput } from "./auth-input";
import type { AuthFormData } from "@/features/types/auth";

interface Props {
  form: AuthFormData;
  setForm: React.Dispatch<React.SetStateAction<AuthFormData>>;
}

export function AuthEmailField({ form, setForm }: Props) {
  return (
    <AuthInput
      label="Email"
      type="email"
      required
      value={form.email}
      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
    />
  );
}
