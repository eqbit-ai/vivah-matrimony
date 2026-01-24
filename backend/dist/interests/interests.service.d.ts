import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
export interface SendInterestDto {
    receiverId: string;
    message?: string;
}
export interface RespondInterestDto {
    status: 'ACCEPTED' | 'REJECTED';
}
export declare class InterestsService {
    private prisma;
    private notificationsService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, emailService: EmailService);
    sendInterest(senderId: string, dto: SendInterestDto): Promise<{
        message: string;
        interest: any;
    }>;
    respondToInterest(userId: string, interestId: string, dto: RespondInterestDto): Promise<{
        message: string;
        interest: any;
    }>;
    getSentInterests(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReceivedInterests(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMutualMatches(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private notifyAdminsOfInterest;
    private calculateAge;
}
