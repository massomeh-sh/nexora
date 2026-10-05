export interface AuthUser {
    _id: string;
    name: string;
    email: string;
}


export interface AuthResponse {
    success: boolean;
    message: string;
    data: AuthUser;
}

export type AuthResponseWithoutData = Omit<AuthResponse, "data">;

export interface SignUpParams {
    name: string,
    email: string,
    phone: string,
    password: string,
}

export interface SignInParams {
    email: string;
    password: string;
}


export interface ResetPasswordParams {
    password: string;
    token: string;
}

export interface MeResponse {
    success: boolean;
    data: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    }
}
