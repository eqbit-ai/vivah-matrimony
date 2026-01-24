import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        profile: {
            gender: import(".prisma/client").$Enums.Gender;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
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
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            userId: string;
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
    }>;
    getProfileViews(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            viewer: {
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
        } & {
            id: string;
            viewerId: string;
            viewedId: string;
            viewedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
