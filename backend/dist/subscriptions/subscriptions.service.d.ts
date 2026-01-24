import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
export interface CreateOrderDto {
    planType: 'BASIC' | 'PREMIUM';
}
export interface VerifyPaymentDto {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private razorpay;
    constructor(prisma: PrismaService, configService: ConfigService);
    getSubscriptionStatus(userId: string): Promise<{
        isExpired: boolean | null;
        daysRemaining: number | null;
        user: {
            email: string;
            profile: {
                firstName: string;
                lastName: string;
            } | null;
        };
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
    getAvailablePlans(): {
        id: string;
        name: string;
        amount: number;
        amountDisplay: string;
        duration: number;
        durationDisplay: string;
        features: string[];
    }[];
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        keyId: string | undefined;
        prefill: {
            name: string;
            email: string;
            contact: string | undefined;
        };
    }>;
    verifyPayment(userId: string, dto: VerifyPaymentDto): Promise<{
        message: string;
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
}
