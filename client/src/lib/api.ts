export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload =
    contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const errorPayload = payload as
      | {
          error?: {
            code?: string;
            message?: string;
          };
        }
      | null;

    throw new ApiError(
      errorPayload?.error?.message ?? "Request failed.",
      response.status,
      errorPayload?.error?.code ?? "request_error",
    );
  }

  return payload as T;
}
