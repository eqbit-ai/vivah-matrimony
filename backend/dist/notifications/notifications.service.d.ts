import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
}
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createNotification(dto: CreateNotificationDto): Promise<any>;
    getNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        data: any;
        unreadCount: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(userId: string, notificationId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: any;
    }>;
}
