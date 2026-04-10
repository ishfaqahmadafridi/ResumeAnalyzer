import { AuthInput } from "./auth-input";
import type { AuthFormData } from "@/features/types/auth";

interface Props {
  form: AuthFormData;
  setForm: React.Dispatch<React.SetStateAction<AuthFormData>>;
}

export function AuthPasswordField({ form, setForm }: Props) {
  return (
    <AuthInput
      label="Password"
      type="password"
      required
      value={form.password}
      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
    />
  );
}
