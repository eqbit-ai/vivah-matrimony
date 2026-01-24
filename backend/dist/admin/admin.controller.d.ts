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
            email: string;
            id: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            emailVerifyToken: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            receiver: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
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
                firstName: string;
                lastName: string;
                gender: import(".prisma/client").$Enums.Gender;
                dateOfBirth: Date;
                religion: import(".prisma/client").$Enums.Religion;
                phone: string;
                state: string;
                city: string;
                education: string;
                profession: string;
                caste: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                height: number | null;
                weight: number | null;
                complexion: string | null;
                bodyType: string | null;
                subCaste: string | null;
                motherTongue: string | null;
                gothra: string | null;
                country: string;
                pincode: string | null;
                educationDetail: string | null;
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
            email: string;
            id: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            emailVerifyToken: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
                sortOrder: number;
                profileId: string;
                imageUrl: string;
                isPrimary: boolean;
                caption: string | null;
            }[];
            partnerPreferences: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
                profileId: string;
            } | null;
            firstName: string;
            lastName: string;
            gender: import(".prisma/client").$Enums.Gender;
            dateOfBirth: Date;
            religion: import(".prisma/client").$Enums.Religion;
            phone: string;
            state: string;
            city: string;
            education: string;
            profession: string;
            caste: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            height: number | null;
            weight: number | null;
            complexion: string | null;
            bodyType: string | null;
            subCaste: string | null;
            motherTongue: string | null;
            gothra: string | null;
            country: string;
            pincode: string | null;
            educationDetail: string | null;
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
            alternatePhone: string | null;
            profilePicture: string | null;
            isComplete: boolean;
            isVerified: boolean;
            verifiedAt: Date | null;
            verifiedBy: string | null;
        } | null;
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        } | null;
        sentInterests: ({
            receiver: {
                profile: {
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
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
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
        } & {
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
            viewedByAdmin: boolean;
            adminNotes: string | null;
            meetingScheduled: boolean;
            meetingDate: Date | null;
            meetingVenue: string | null;
            meetingNotes: string | null;
            respondedAt: Date | null;
        })[];
        email: string;
        id: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        emailVerifyToken: string | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
                    phone: string;
                    city: string;
                    profession: string;
                    profilePicture: string | null;
                } | null;
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            receiver: {
                profile: {
                    age: number;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    phone: string;
                    city: string;
                    profession: string;
                    profilePicture: string | null;
                } | null;
                email: string;
                id: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                emailVerifyToken: string | null;
                passwordResetToken: string | null;
                passwordResetExpires: Date | null;
                createdAt: Date;
                updatedAt: Date;
                lastLoginAt: Date | null;
                isActive: boolean;
            };
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
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
            message: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterestStatus;
            senderId: string;
            receiverId: string;
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
                profile: {
                    firstName: string;
                    lastName: string;
                    phone: string;
                } | null;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    deactivateSubscription(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
