import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        profile: {
            firstName: string;
            lastName: string;
            gender: import(".prisma/client").$Enums.Gender;
            id: string;
        } | null;
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            endDate: Date | null;
        } | null;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        isActive: boolean;
    }>;
}
export {};
