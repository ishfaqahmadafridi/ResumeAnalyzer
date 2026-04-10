export type AuthMode = "login" | "register";

export interface AuthFormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthFormProps {
  mode: AuthMode;
}
