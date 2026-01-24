import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Gender, Religion, InterestStatus, SubscriptionStatus } from '@prisma/client';
export interface AdminSearchUsersDto {
    page?: number;
    limit?: number;
    gender?: Gender;
    religion?: Religion;
    caste?: string;
    minAge?: number;
    maxAge?: number;
    state?: string;
    city?: string;
    subscriptionStatus?: SubscriptionStatus;
    search?: string;
}
export interface ScheduleMeetingDto {
    interestId: string;
    meetingDate: string;
    meetingVenue: string;
    meetingNotes?: string;
}
export declare class AdminService {
    private prisma;
    private emailService;
    private notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService, notificationsService: NotificationsService);
    getDashboardMetrics(): Promise<{
        metrics: {
            totalUsers: any;
            maleProfiles: any;
            femaleProfiles: any;
            totalInterests: any;
            pendingInterests: any;
            acceptedInterests: any;
            paidSubscriptions: any;
            freeUsers: number;
        };
        recentUsers: any;
        recentInterests: any;
    }>;
    searchUsers(dto: AdminSearchUsersDto): Promise<{
        data: {
            profile: any;
            subscription: never;
            email: string;
            password: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserFullDetails(userId: string): Promise<{
        profile: any;
        subscription: never;
        sentInterests: never;
        receivedInterests: never;
        email: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllInterests(page?: number, limit?: number, status?: InterestStatus): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    scheduleMeeting(adminId: string, dto: ScheduleMeetingDto): Promise<{
        message: string;
        interest: any;
    }>;
    verifyProfile(adminId: string, userId: string): Promise<{
        message: string;
    }>;
    deactivateUser(adminId: string, userId: string, reason: string): Promise<{
        message: string;
    }>;
    reactivateUser(adminId: string, userId: string): Promise<{
        message: string;
    }>;
    getAdminLogs(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private calculateAge;
}
