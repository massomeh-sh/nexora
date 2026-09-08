export interface AuthUser {
    _id: string;
    name: string;
    email: string;
}


export interface AuthResponse {
    success: boolean;
    data: AuthUser;
}

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

export interface MeResponse {
    success: boolean;
    data: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    }
}
