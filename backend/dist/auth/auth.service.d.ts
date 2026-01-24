import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SignUpDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
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
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<{
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
    private generateToken;
}
