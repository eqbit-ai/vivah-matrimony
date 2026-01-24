import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
