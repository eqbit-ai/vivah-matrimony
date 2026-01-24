import { Gender, Religion } from '@prisma/client';
export declare class SignUpDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;
    religion: Religion;
    phone: string;
    state: string;
    city: string;
    education: string;
    profession: string;
    caste?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: string;
        profile?: {
            id: string;
            firstName: string;
            lastName: string;
            profilePicture: string | null;
        };
    };
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
