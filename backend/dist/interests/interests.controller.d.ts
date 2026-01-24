import { InterestsService, SendInterestDto, RespondInterestDto } from './interests.service';
export declare class InterestsController {
    private interestsService;
    constructor(interestsService: InterestsService);
    sendInterest(userId: string, dto: SendInterestDto): Promise<{
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
}
