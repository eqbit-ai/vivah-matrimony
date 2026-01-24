"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signUp(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const emailVerifyToken = (0, uuid_1.v4)();
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    emailVerifyToken,
                    role: client_1.Role.USER,
                },
            });
            await tx.profile.create({
                data: {
                    userId: newUser.id,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    gender: dto.gender,
                    dateOfBirth: new Date(dto.dateOfBirth),
                    religion: dto.religion,
                    phone: dto.phone,
                    state: dto.state,
                    city: dto.city,
                    education: dto.education,
                    profession: dto.profession,
                    caste: dto.caste,
                    isComplete: false,
                },
            });
            await tx.subscription.create({
                data: {
                    userId: newUser.id,
                    status: 'FREE',
                    planName: 'Free',
                },
            });
            return newUser;
        });
        await this.emailService.sendVerificationEmail(user.email, emailVerifyToken);
        const userWithProfile = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                profile: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                    },
                },
            },
        });
        const accessToken = this.generateToken(user.id, user.email, user.role);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: userWithProfile?.profile || undefined,
            },
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            include: {
                profile: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account has been deactivated');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const accessToken = this.generateToken(user.id, user.email, user.role);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile || undefined,
            },
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent' };
        }
        const resetToken = (0, uuid_1.v4)();
        const resetExpires = new Date(Date.now() + 3600000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: resetExpires,
            },
        });
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
        return { message: 'If the email exists, a password reset link has been sent' };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: dto.token,
                passwordResetExpires: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        return { message: 'Password has been reset successfully' };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        return { message: 'Password changed successfully' };
    }
    async verifyEmail(token) {
        const user = await this.prisma.user.findFirst({
            where: { emailVerifyToken: token },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerifyToken: null,
            },
        });
        return { message: 'Email verified successfully' };
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isActive: true },
            include: {
                profile: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        gender: true,
                        profilePicture: true,
                    },
                },
                subscription: {
                    select: {
                        id: true,
                        status: true,
                        planName: true,
                        endDate: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '7d',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map