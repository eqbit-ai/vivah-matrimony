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
    getStatus(userId: string): Promise<any>;
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
}
