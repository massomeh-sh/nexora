export const BASE_URL = "http://localhost:5000";

export class ApiError extends Error {
    code?: string;
    data?: unknown;

    constructor(message?: string, code?: string, data?: unknown) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new ApiError(errorData.message || "خطایی رخ داد", errorData?.code, errorData);
    }
    return res.json();
}