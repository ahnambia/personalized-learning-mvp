// Base URL points to backend API (CORS already allows 5176)
const API_BASE = "http://localhost:8000";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T = unknown>(
  path: string,
  opts: {
    method?: HttpMethod;
    body?: any;
    token?: string | null;
    headers?: Record<string, string>;
  } = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const { method = "GET", body, token = localStorage.getItem("token"), headers = {} } = opts;

  const h = new Headers(headers);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  if (token) h.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON (rare)
  }
  return { ok: res.ok, status: res.status, data };
}
