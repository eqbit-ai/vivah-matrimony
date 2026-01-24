import { AdminService, AdminSearchUsersDto, ScheduleMeetingDto } from './admin.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { InterestStatus, SubscriptionStatus } from '@prisma/client';
export declare class AdminController {
    private adminService;
    private subscriptionsService;
    constructor(adminService: AdminService, subscriptionsService: SubscriptionsService);
    getDashboard(): Promise<{
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
    getUserDetails(userId: string): Promise<{
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
    verifyProfile(adminId: string, userId: string): Promise<{
        message: string;
    }>;
    deactivateUser(adminId: string, userId: string, reason: string): Promise<{
        message: string;
    }>;
    reactivateUser(adminId: string, userId: string): Promise<{
        message: string;
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
    getAllSubscriptions(page?: number, limit?: number, status?: SubscriptionStatus): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    activateSubscription(userId: string, days: number): Promise<any>;
    deactivateSubscription(userId: string): Promise<any>;
    getAdminLogs(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
