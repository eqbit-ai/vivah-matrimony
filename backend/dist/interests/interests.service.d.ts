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
        interest: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
            message: string | null;
            viewedByAdmin: boolean;
            adminNotes: string | null;
            meetingScheduled: boolean;
            meetingDate: Date | null;
            meetingVenue: string | null;
            meetingNotes: string | null;
            respondedAt: Date | null;
        };
    }>;
    respondToInterest(userId: string, interestId: string, dto: RespondInterestDto): Promise<{
        message: string;
        interest: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
            message: string | null;
            viewedByAdmin: boolean;
            adminNotes: string | null;
            meetingScheduled: boolean;
            meetingDate: Date | null;
            meetingVenue: string | null;
            meetingNotes: string | null;
            respondedAt: Date | null;
        };
    }>;
    getSentInterests(userId: string, page?: number, limit?: number): Promise<{
        data: {
            receiver: {
                profile: {
                    age: number;
                    id: string;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    state: string;
                    city: string;
                    profession: string;
                    profilePicture: string | null;
                } | null;
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
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
            message: string | null;
            viewedByAdmin: boolean;
            adminNotes: string | null;
            meetingScheduled: boolean;
            meetingDate: Date | null;
            meetingVenue: string | null;
            meetingNotes: string | null;
            respondedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReceivedInterests(userId: string, page?: number, limit?: number): Promise<{
        data: {
            sender: {
                profile: {
                    age: number;
                    id: string;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    state: string;
                    city: string;
                    profession: string;
                    profilePicture: string | null;
                } | null;
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
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
            message: string | null;
            viewedByAdmin: boolean;
            adminNotes: string | null;
            meetingScheduled: boolean;
            meetingDate: Date | null;
            meetingVenue: string | null;
            meetingNotes: string | null;
            respondedAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMutualMatches(userId: string, page?: number, limit?: number): Promise<{
        data: {
            interestId: string;
            matchedAt: Date | null;
            user: {
                profile: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    city: string;
                    profession: string;
                    profilePicture: string | null;
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
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private notifyAdminsOfInterest;
    private calculateAge;
}
