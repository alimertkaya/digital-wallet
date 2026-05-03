export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    tckn: string;
    birthDate: string | number[];
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isKycVerified: boolean;
}

export interface UpdateEmailRequest {
    email: string;
}

export interface UpdatePhoneRequest {
    phoneNumber: string;
}

export interface VerifyCodeRequest {
    code: string;
}

export type EditableField = 'email' | 'phone';

export type VerificationType = 'email' | 'phone';