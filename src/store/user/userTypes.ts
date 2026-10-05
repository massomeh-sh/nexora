export interface UserState {
    _id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    isAuthenticated: boolean;
}