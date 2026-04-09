import { AuthInput } from "./auth-input";
import type { AuthFormData } from "@/features/types/auth";

interface Props {
  form: AuthFormData;
  setForm: React.Dispatch<React.SetStateAction<AuthFormData>>;
}

export function AuthUsernameField({ form, setForm }: Props) {
  return (
    <AuthInput
      label="Username"
      required
      value={form.username}
      onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
    />
  );
}
