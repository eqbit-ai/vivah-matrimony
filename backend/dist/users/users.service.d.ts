import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        profile: {
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
    }>;
    getProfileViews(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            viewer: {
                profile: {
                    firstName: string;
                    lastName: string;
                    city: string;
                    profession: string;
                    id: string;
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
