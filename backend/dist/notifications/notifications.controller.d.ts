import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, page?: string, limit?: string, unreadOnly?: string): Promise<{
        data: any;
        unreadCount: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: any;
    }>;
    markAsRead(userId: string, notificationId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
}
