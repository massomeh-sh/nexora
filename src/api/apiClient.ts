export const BASE_URL = "http://localhost:5000";

export class ApiError extends Error {
    code?: string;

    constructor(message?: string, code?: string) {
        super(message);
        this.code = code;
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
        throw new ApiError(errorData.message || "خطایی رخ داد", errorData?.code);
    }
    return res.json();
}