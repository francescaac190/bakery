export class HttpError extends Error {
    status: number;
    body: unknown;

    constructor(status: number, body: unknown) {
        super(`HTTP error: ${status}`);
        this.status = status;
        this.body = body;
    }
}

type RequestOptions = {
    signal?: AbortSignal;
    headers?: Record<string, string>;
}

export async function getJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        signal: options.signal,
    });

    const text = await res.text();

    const body = text ? safeJsonParse(text) : null;

    if (!res.ok) {
        throw new HttpError(res.status, body);
    }

    return body as T;
}

function safeJsonParse(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }