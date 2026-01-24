import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(dto: SignUpDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    getCurrentUser(userId: string): Promise<{
        profile: {
            gender: import(".prisma/client").$Enums.Gender;
            id: string;
            firstName: string;
            lastName: string;
            profilePicture: string | null;
        } | null;
        subscription: {
            id: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planName: string;
            endDate: Date | null;
        } | null;
    } & {
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        id: string;
        email: string;
        passwordHash: string;
        isEmailVerified: boolean;
        emailVerifyToken: string | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
}
