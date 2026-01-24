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
    getSubscriptionStatus(userId: string): Promise<any>;
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
            contact: any;
        };
    }>;
    verifyPayment(userId: string, dto: VerifyPaymentDto): Promise<{
        message: string;
        subscription: any;
    }>;
    getAllSubscriptions(page?: number, limit?: number, status?: SubscriptionStatus): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    activateSubscription(userId: string, days: number): Promise<any>;
    deactivateSubscription(userId: string): Promise<any>;
}
