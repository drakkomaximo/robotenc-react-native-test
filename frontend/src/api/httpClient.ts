import { API_BASE_URL } from "@/config/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<TResponse>({
  method = "GET",
  path,
  body,
  headers,
}: RequestOptions): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Request failed with status ${response.status}: ${errorText || response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const httpClient = {
  get: <TResponse>(path: string, headers?: Record<string, string>) =>
    request<TResponse>({ method: "GET", path, headers }),
  post: <TResponse>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => request<TResponse>({ method: "POST", path, body, headers }),
};
