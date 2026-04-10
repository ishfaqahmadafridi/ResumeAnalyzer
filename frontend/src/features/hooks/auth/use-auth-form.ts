import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/store/auth-slice";
import { submitAuthData } from "@/features/utils/auth/auth-actions";
import type { AuthFormData, AuthMode } from "@/features/types/auth";

export function useAuthForm(mode: AuthMode) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<AuthFormData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await submitAuthData(mode, form);
        localStorage.setItem("cvforge-auth", JSON.stringify(response));
        dispatch(setAuth(response));
        toast.success(mode === "register" ? "Account created" : "Welcome back");
        router.push("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Authentication failed");
      }
    });
  }

  return { form, setForm, isPending, handleSubmit };
}
