import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, page?: string, limit?: string, unreadOnly?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
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
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(userId: string, notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
}
