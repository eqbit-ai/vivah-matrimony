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
    createNotification(dto: CreateNotificationDto): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    getNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        data: {
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            message: string;
            id: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            isRead: boolean;
            readAt: Date | null;
        }[];
        unreadCount: number;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(userId: string, notificationId: string): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
}
