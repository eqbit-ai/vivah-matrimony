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
}
