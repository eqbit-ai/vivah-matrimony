import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AdminService, AdminSearchUsersDto, ScheduleMeetingDto } from './admin.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { JwtAuthGuard, AdminGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InterestStatus, SubscriptionStatus } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  async getDashboard() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Search and filter users' })
  @ApiResponse({ status: 200, description: 'Paginated users list' })
  async searchUsers(@Query() dto: AdminSearchUsersDto) {
    return this.adminService.searchUsers(dto);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user full details' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserFullDetails(userId);
  }

  @Put('users/:id/verify')
  @ApiOperation({ summary: 'Verify user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Profile verified' })
  async verifyProfile(
    @CurrentUser('id') adminId: string,
    @Param('id') userId: string,
  ) {
    return this.adminService.verifyProfile(adminId, userId);
  }

  @Put('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deactivated' })
  async deactivateUser(
    @CurrentUser('id') adminId: string,
    @Param('id') userId: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.deactivateUser(adminId, userId, reason);
  }

  @Put('users/:id/reactivate')
  @ApiOperation({ summary: 'Reactivate user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User reactivated' })
  async reactivateUser(
    @CurrentUser('id') adminId: string,
    @Param('id') userId: string,
  ) {
    return this.adminService.reactivateUser(adminId, userId);
  }

  @Get('interests')
  @ApiOperation({ summary: 'Get all interests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: InterestStatus })
  @ApiResponse({ status: 200, description: 'Paginated interests list' })
  async getAllInterests(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: InterestStatus,
  ) {
    return this.adminService.getAllInterests(+page, +limit, status);
  }

  @Post('interests/schedule-meeting')
  @ApiOperation({ summary: 'Schedule meeting for matched users' })
  @ApiResponse({ status: 201, description: 'Meeting scheduled' })
  async scheduleMeeting(
    @CurrentUser('id') adminId: string,
    @Body() dto: ScheduleMeetingDto,
  ) {
    return this.adminService.scheduleMeeting(adminId, dto);
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: SubscriptionStatus })
  @ApiResponse({ status: 200, description: 'Paginated subscriptions list' })
  async getAllSubscriptions(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: SubscriptionStatus,
  ) {
    return this.subscriptionsService.getAllSubscriptions(+page, +limit, status);
  }

  @Put('subscriptions/:userId/activate')
  @ApiOperation({ summary: 'Manually activate subscription' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Subscription activated' })
  async activateSubscription(
    @Param('userId') userId: string,
    @Body('days') days: number,
  ) {
    return this.subscriptionsService.activateSubscription(userId, days);
  }

  @Put('subscriptions/:userId/deactivate')
  @ApiOperation({ summary: 'Deactivate subscription' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Subscription deactivated' })
  async deactivateSubscription(@Param('userId') userId: string) {
    return this.subscriptionsService.deactivateSubscription(userId);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get admin activity logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated logs' })
  async getAdminLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.adminService.getAdminLogs(+page, +limit);
  }
}
