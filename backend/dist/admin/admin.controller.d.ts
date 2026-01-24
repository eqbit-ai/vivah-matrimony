import { AdminService, AdminSearchUsersDto, ScheduleMeetingDto } from './admin.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { InterestStatus, SubscriptionStatus } from '@prisma/client';
export declare class AdminController {
    private adminService;
    private subscriptionsService;
    constructor(adminService: AdminService, subscriptionsService: SubscriptionsService);
    getDashboard(): Promise<{
        metrics: {
            totalUsers: number;
            maleProfiles: number;
            femaleProfiles: number;
            totalInterests: number;
            pendingInterests: number;
            acceptedInterests: number;
            paidSubscriptions: number;
            freeUsers: number;
        };
        recentUsers: ({
            profile: {
                firstName: string;
                lastName: string;
                profilePicture: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            emailVerifyToken: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            lastLoginAt: Date | null;
            isActive: boolean;
        })[];
        recentInterests: ({
            sender: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            receiver: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InterestStatus;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
    }>;
    searchUsers(dto: AdminSearchUsersDto): Promise<{
        data: {
            profile: {
                age: number;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                gender: import(".prisma/client").$Enums.Gender;
                dateOfBirth: Date;
                height: number | null;
                weight: number | null;
                complexion: string | null;
                bodyType: string | null;
                religion: import(".prisma/client").$Enums.Religion;
                caste: string | null;
                subCaste: string | null;
                motherTongue: string | null;
                gothra: string | null;
                country: string;
                state: string;
                city: string;
                pincode: string | null;
                education: string;
                educationDetail: string | null;
                profession: string;
                employer: string | null;
                annualIncome: string | null;
                workingCity: string | null;
                fatherName: string | null;
                fatherOccupation: string | null;
                motherName: string | null;
                motherOccupation: string | null;
                siblings: number | null;
                familyType: string | null;
                familyStatus: string | null;
                familyValues: string | null;
                maritalStatus: import(".prisma/client").$Enums.MaritalStatus;
                diet: string | null;
                smoking: string | null;
                drinking: string | null;
                bio: string | null;
                hobbies: string[];
                phone: string;
                alternatePhone: string | null;
                profilePicture: string | null;
                isComplete: boolean;
                isVerified: boolean;
                verifiedAt: Date | null;
                verifiedBy: string | null;
            } | null;
            subscription: {
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                endDate: Date | null;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            emailVerifyToken: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            lastLoginAt: Date | null;
            isActive: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserDetails(userId: string): Promise<{
        profile: {
            age: number;
            gallery: {
                id: string;
                createdAt: Date;
                profileId: string;
                imageUrl: string;
                isPrimary: boolean;
                caption: string | null;
                sortOrder: number;
            }[];
            partnerPreferences: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                profileId: string;
                minAge: number;
                maxAge: number;
                minHeight: number | null;
                maxHeight: number | null;
                religions: import(".prisma/client").$Enums.Religion[];
                castes: string[];
                countries: string[];
                states: string[];
                cities: string[];
                minEducation: string | null;
                professions: string[];
                maritalStatuses: import(".prisma/client").$Enums.MaritalStatus[];
                diets: string[];
                aboutPartner: string | null;
            } | null;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            gender: import(".prisma/client").$Enums.Gender;
            dateOfBirth: Date;
            height: number | null;
            weight: number | null;
            complexion: string | null;
            bodyType: string | null;
            religion: import(".prisma/client").$Enums.Religion;
            caste: string | null;
            subCaste: string | null;
            motherTongue: string | null;
            gothra: string | null;
            country: string;
            state: string;
            city: string;
            pincode: string | null;
            education: string;
            educationDetail: string | null;
            profession: string;
            employer: string | null;
            annualIncome: string | null;
            workingCity: string | null;
            fatherName: string | null;
            fatherOccupation: string | null;
            motherName: string | null;
            motherOccupation: string | null;
            siblings: number | null;
            familyType: string | null;
            familyStatus: string | null;
            familyValues: string | null;
            maritalStatus: import(".prisma/client").$Enums.MaritalStatus;
            diet: string | null;
            smoking: string | null;
            drinking: string | null;
            bio: string | null;
            hobbies: string[];
            phone: string;
            alternatePhone: string | null;
            profilePicture: string | null;
            isComplete: boolean;
            isVerified: boolean;
            verifiedAt: Date | null;
            verifiedBy: string | null;
        } | null;
        subscription: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planName: string;
            amount: number;
            currency: string;
            paymentId: string | null;
            orderId: string | null;
            paymentMethod: string | null;
            startDate: Date | null;
            endDate: Date | null;
            interestsSent: number;
            profilesViewed: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        sentInterests: ({
            receiver: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InterestStatus;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
        receivedInterests: ({
            sender: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.InterestStatus;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        emailVerifyToken: string | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
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
        data: {
            sender: {
                profile: {
                    age: number;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    city: string;
                    profession: string;
                    phone: string;
                    profilePicture: string | null;
                } | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            receiver: {
                profile: {
                    age: number;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    city: string;
                    profession: string;
                    phone: string;
                    profilePicture: string | null;
                } | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            id: string;
            status: import(".prisma/client").$Enums.InterestStatus;
            createdAt: Date;
            updatedAt: Date;
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
    scheduleMeeting(adminId: string, dto: ScheduleMeetingDto): Promise<{
        message: string;
        interest: {
            id: string;
            status: import(".prisma/client").$Enums.InterestStatus;
            createdAt: Date;
            updatedAt: Date;
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
    getAllSubscriptions(page?: number, limit?: number, status?: SubscriptionStatus): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                profile: {
                    firstName: string;
                    lastName: string;
                    phone: string;
                } | null;
            };
        } & {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planName: string;
            amount: number;
            currency: string;
            paymentId: string | null;
            orderId: string | null;
            paymentMethod: string | null;
            startDate: Date | null;
            endDate: Date | null;
            interestsSent: number;
            profilesViewed: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    activateSubscription(userId: string, days: number): Promise<{
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        amount: number;
        currency: string;
        paymentId: string | null;
        orderId: string | null;
        paymentMethod: string | null;
        startDate: Date | null;
        endDate: Date | null;
        interestsSent: number;
        profilesViewed: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deactivateSubscription(userId: string): Promise<{
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planName: string;
        amount: number;
        currency: string;
        paymentId: string | null;
        orderId: string | null;
        paymentMethod: string | null;
        startDate: Date | null;
        endDate: Date | null;
        interestsSent: number;
        profilesViewed: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAdminLogs(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            adminId: string;
            action: string;
            entity: string;
            entityId: string | null;
            details: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
