import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
