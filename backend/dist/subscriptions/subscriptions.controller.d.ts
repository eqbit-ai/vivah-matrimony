import { SubscriptionsService, CreateOrderDto, VerifyPaymentDto } from './subscriptions.service';
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getPlans(): {
        id: string;
        name: string;
        amount: number;
        amountDisplay: string;
        duration: number;
        durationDisplay: string;
        features: string[];
    }[];
    getStatus(userId: string): Promise<{
        isExpired: boolean | null;
        daysRemaining: number | null;
        user: {
            profile: {
                firstName: string;
                lastName: string;
            } | null;
            email: string;
        };
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
        };
    }>;
}
