import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  SubscriptionsService,
  CreateOrderDto,
  VerifyPaymentDto,
} from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) { }

  /* =====================================================
     PLANS (PUBLIC)
  ====================================================== */

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  getPlans() {
    return this.subscriptionsService.getAvailablePlans();
  }

  /* =====================================================
     CURRENT USER SUBSCRIPTION
     ✅ ADDED FOR DASHBOARD (/subscriptions/me)
  ====================================================== */

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user subscription (dashboard)' })
  @ApiResponse({ status: 200, description: 'Subscription details' })
  async getMySubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getSubscriptionStatus(userId);
  }

  /* =====================================================
     LEGACY / BACKWARD COMPAT
     (DO NOT REMOVE – frontend/admin may use it)
  ====================================================== */

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current subscription status' })
  @ApiResponse({ status: 200, description: 'Subscription details' })
  async getStatus(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getSubscriptionStatus(userId);
  }

  /* =====================================================
     PAYMENTS
  ====================================================== */

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create payment order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.subscriptionsService.createOrder(userId, dto);
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify payment after completion' })
  @ApiResponse({ status: 200, description: 'Payment verified' })
  async verifyPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.subscriptionsService.verifyPayment(userId, dto);
  }
}
