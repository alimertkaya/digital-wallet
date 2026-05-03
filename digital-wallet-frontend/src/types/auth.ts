export interface LoginRequest {
    username: string;
    password?: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    tckn: string;
    birthDate: string;
    password?: string;
}