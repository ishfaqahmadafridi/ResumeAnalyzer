import type {
  AgentWorkflowResult,
  AuthResponse,
  CVRecord,
  CVRoleAnalysis,
  CVStructuredData,
  UserProfile,
} from "@/types";
import { API_URL } from "./constants";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: BodyInit | null;
  json?: unknown;
  headers?: HeadersInit;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.token) {
    headers.set("Authorization", `Token ${options.token}`);
  }

  let body = options.body ?? null;
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const data = await response.json();
      message = data.detail || data.non_field_errors?.[0] || Object.values(data)[0] || message;
    } catch {}
    throw new Error(String(message));
  }

  return response.json() as Promise<T>;
}

export const api = {
  register(payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) {
    return request<AuthResponse>("/auth/register/", { method: "POST", json: payload });
  },
  login(payload: { username?: string; email?: string; password: string }) {
    return request<AuthResponse>("/auth/login/", { method: "POST", json: payload });
  },
  me(token: string) {
    return request<UserProfile>("/auth/me/", { token });
  },
  listCVs(token: string) {
    return request<CVRecord[]>("/cv/", { token });
  },
  uploadCV(token: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<CVRecord>("/cv/upload/", { method: "POST", token, body: formData });
  },
  analyzeRole(token: string, cvId: string, role: string) {
    return request<CVRoleAnalysis>("/cv/analyze-role/", {
      method: "POST",
      token,
      json: { cv_id: cvId, role },
    });
  },
  parseStructured(token: string, payload: { cv_id?: string; raw_text?: string }) {
    return request<CVStructuredData>("/cv/parse-structured/", {
      method: "POST",
      token,
      json: payload,
    });
  },
  orchestrate(token: string, payload: { user_id: string; cv_text: string; action?: string; action_data?: any; thread_id?: string }) {
    return request<AgentWorkflowResult>("/core/orchestrate/", {
      method: "POST",
      token,
      json: payload,
    });
  },
};
