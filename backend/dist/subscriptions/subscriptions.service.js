"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
const Razorpay = require('razorpay');
const PLANS = {
    BASIC: {
        name: 'Basic Plan',
        amount: 149900,
        duration: 90,
    },
    PREMIUM: {
        name: 'Premium Plan',
        amount: 299900,
        duration: 180,
    },
};
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(SubscriptionsService_1.name);
        this.razorpay = null;
        const keyId = this.configService.get('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (keyId && keySecret) {
            this.razorpay = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });
            this.logger.log('Razorpay initialized');
        }
        else {
            this.logger.warn('Razorpay keys not found. Payments are disabled.');
        }
    }
    async getSubscriptionStatus(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        email: true,
                        profile: {
                            select: { firstName: true, lastName: true },
                        },
                    },
                },
            },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const isExpired = subscription.endDate && new Date(subscription.endDate) < new Date();
        return {
            ...subscription,
            isExpired,
            daysRemaining: subscription.endDate
                ? Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)))
                : null,
        };
    }
    getAvailablePlans() {
        return Object.entries(PLANS).map(([key, plan]) => ({
            id: key,
            name: plan.name,
            amount: plan.amount,
            amountDisplay: `₹${plan.amount / 100}`,
            duration: plan.duration,
            durationDisplay: `${plan.duration} days`,
            features: key === 'BASIC'
                ? [
                    'View full profiles',
                    'View uploaded photos',
                    'Express unlimited interests',
                    '90 days validity',
                ]
                : [
                    'All Basic features',
                    'Priority profile listing',
                    'Profile highlight badge',
                    '180 days validity',
                ],
        }));
    }
    async createOrder(userId, dto) {
        if (!this.razorpay) {
            throw new common_1.BadRequestException('Payment service not configured');
        }
        const plan = PLANS[dto.planType];
        if (!plan) {
            throw new common_1.BadRequestException('Invalid plan type');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        try {
            const order = await this.razorpay.orders.create({
                amount: plan.amount,
                currency: 'INR',
                receipt: `order_${userId}_${Date.now()}`,
                notes: {
                    userId,
                    planType: dto.planType,
                },
            });
            await this.prisma.subscription.update({
                where: { userId },
                data: {
                    orderId: order.id,
                    amount: plan.amount,
                    planName: plan.name,
                },
            });
            return {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: this.configService.get('RAZORPAY_KEY_ID'),
                prefill: {
                    name: `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`,
                    email: user.email,
                    contact: user.profile?.phone,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to create order', error);
            throw new common_1.BadRequestException('Failed to create order');
        }
    }
    async verifyPayment(userId, dto) {
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!keySecret) {
            throw new common_1.BadRequestException('Payment secret not configured');
        }
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
            .digest('hex');
        if (expectedSignature !== dto.razorpay_signature) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription || subscription.orderId !== dto.razorpay_order_id) {
            throw new common_1.BadRequestException('Order not found');
        }
        const duration = subscription.amount === PLANS.PREMIUM.amount
            ? PLANS.PREMIUM.duration
            : PLANS.BASIC.duration;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + duration);
        const updatedSubscription = await this.prisma.subscription.update({
            where: { userId },
            data: {
                status: client_1.SubscriptionStatus.PAID,
                paymentId: dto.razorpay_payment_id,
                startDate,
                endDate,
                paymentMethod: 'razorpay',
            },
        });
        return {
            message: 'Payment verified successfully',
            subscription: updatedSubscription,
        };
    }
    async getAllSubscriptions(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [subscriptions, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return {
            data: subscriptions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async activateSubscription(userId, days) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return this.prisma.subscription.update({
            where: { userId },
            data: {
                status: client_1.SubscriptionStatus.PAID,
                startDate,
                endDate,
                planName: 'Admin Activated',
            },
        });
    }
    async deactivateSubscription(userId) {
        return this.prisma.subscription.update({
            where: { userId },
            data: {
                status: client_1.SubscriptionStatus.EXPIRED,
                endDate: new Date(),
            },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map