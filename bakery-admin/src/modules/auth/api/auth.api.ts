import type { LoginPayload, LoginResponse } from "../types";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      (json as { error?: { message?: string } })?.error?.message ?? `Error ${response.status}`
    )
  }
  return (json as { data: T }).data
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse<LoginResponse>),
};
