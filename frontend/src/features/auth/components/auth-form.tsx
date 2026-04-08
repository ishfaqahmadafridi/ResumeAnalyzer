"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/store/auth-slice";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response =
          mode === "register"
            ? await api.register(form)
            : await api.login({ username: form.username, email: form.email, password: form.password });
        localStorage.setItem("cvforge-auth", JSON.stringify(response));
        dispatch(setAuth(response));
        toast.success(mode === "register" ? "Account created" : "Welcome back");
        router.push("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Authentication failed");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-[var(--shadow)]">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
          {mode === "register" ? "Create your workspace" : "Sign in to continue"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">
          {mode === "register" ? "Build your AI job cockpit" : "Return to your dashboard"}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "register" ? (
          <>
            <label className="space-y-2">
              <span className="text-sm font-medium text-stone-700">First name</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
                value={form.first_name}
                onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-stone-700">Last name</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
                value={form.last_name}
                onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
              />
            </label>
          </>
        ) : null}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-700">Username</span>
        <input
          required
          className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-700">Email</span>
        <input
          type="email"
          required
          className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-700">Password</span>
        <input
          type="password"
          required
          className="w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 outline-none"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {isPending ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
      </button>

      <p className="text-sm text-stone-600">
        {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
        <Link className="font-semibold text-emerald-800" href={mode === "register" ? "/auth/login" : "/auth/register"}>
          {mode === "register" ? "Sign in" : "Register"}
        </Link>
      </p>
    </form>
  );
}
