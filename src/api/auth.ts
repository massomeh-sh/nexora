import {apiFetch} from "./apiClient.ts";
import type {AuthResponse, MeResponse, SignInParams, SignUpParams} from "../types/auth.ts";

export async function signUp(params: SignUpParams): Promise<AuthResponse> {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(params),
    })
}

export async function signIn(params: SignInParams): Promise<AuthResponse> {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(params),
    })
}

export async function getMe(): Promise<MeResponse> {
    return apiFetch("/api/auth/me")
}