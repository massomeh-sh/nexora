import {apiFetch} from "./apiClient.ts";
import type {
    AuthResponse, AuthResponseWithoutData,
    MeResponse,
    ResetPasswordParams,
    SignInParams,
    SignUpParams,
} from "../types/auth.ts";

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

export async function resendVerification(email: string): Promise<AuthResponseWithoutData> {
    return apiFetch("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({email})
    })
}

export async function verifyEmail(token: string): Promise<AuthResponseWithoutData> {
    return apiFetch(`/api/auth/verify-email/${token}`)
}

export async function forgotPassword(email: string): Promise<AuthResponseWithoutData> {
    return apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({email})
    })
}

export async function resetPassword(params: ResetPasswordParams):Promise<AuthResponse> {
    const newPassword = params.password
    return apiFetch(`/api/auth/reset-password/${params.token}`, {
        method: "PUT",
        body: JSON.stringify({password: newPassword})
    })
}