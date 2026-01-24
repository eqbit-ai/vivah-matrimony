import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        profile: never;
        subscription: never;
    } & {
        email: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfileViews(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
