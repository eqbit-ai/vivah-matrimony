import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import * as crypto from 'crypto';

// ✅ Razorpay is CommonJS – MUST be required
const Razorpay = require('razorpay');

export interface CreateOrderDto {
  planType: 'BASIC' | 'PREMIUM';
}

export interface VerifyPaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const PLANS = {
  BASIC: {
    name: 'Basic Plan',
    amount: 149900, // ₹1499 in paise
    duration: 90,
  },
  PREMIUM: {
    name: 'Premium Plan',
    amount: 299900, // ₹2999 in paise
    duration: 180,
  },
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private razorpay: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || '',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || '',
    });
  }

  // Get current subscription status
  async getSubscriptionStatus(userId: string) {
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
      throw new NotFoundException('Subscription not found');
    }

    const isExpired =
      subscription.endDate && new Date(subscription.endDate) < new Date();

    return {
      ...subscription,
      isExpired,
      daysRemaining: subscription.endDate
        ? Math.max(
          0,
          Math.ceil(
            (subscription.endDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
          ),
        )
        : null,
    };
  }

  // Get available plans
  getAvailablePlans() {
    return Object.entries(PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      amount: plan.amount,
      amountDisplay: `₹${plan.amount / 100}`,
      duration: plan.duration,
      durationDisplay: `${plan.duration} days`,
      features:
        key === 'BASIC'
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

  // Create Razorpay order
  async createOrder(userId: string, dto: CreateOrderDto) {
    const plan = PLANS[dto.planType];
    if (!plan) {
      throw new BadRequestException('Invalid plan type');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
        prefill: {
          name: `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`,
          email: user.email,
          contact: user.profile?.phone,
        },
      };
    } catch (error) {
      this.logger.error('Failed to create Razorpay order', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  // Verify payment
  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      throw new BadRequestException('Payment secret not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.orderId !== razorpay_order_id) {
      throw new BadRequestException('Order not found');
    }

    const duration =
      subscription.amount === PLANS.PREMIUM.amount
        ? PLANS.PREMIUM.duration
        : PLANS.BASIC.duration;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const updatedSubscription = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.PAID,
        paymentId: razorpay_payment_id,
        startDate,
        endDate,
        paymentMethod: 'razorpay',
      },
    });

    this.logger.log(`Payment verified for user ${userId}`);

    return {
      message: 'Payment verified successfully',
      subscription: updatedSubscription,
    };
  }

  // Admin: Get all subscriptions
  async getAllSubscriptions(page = 1, limit = 20, status?: SubscriptionStatus) {
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
                select: { firstName: true, lastName: true, phone: true },
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

  // Admin: Manually activate subscription
  async activateSubscription(userId: string, days: number) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.PAID,
        startDate,
        endDate,
        planName: 'Admin Activated',
      },
    });
  }

  // Admin: Deactivate subscription
  async deactivateSubscription(userId: string) {
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.EXPIRED,
        endDate: new Date(),
      },
    });
  }
}
