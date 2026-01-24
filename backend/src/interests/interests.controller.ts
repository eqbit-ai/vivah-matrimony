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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InterestsService, SendInterestDto, RespondInterestDto } from './interests.service';
import { JwtAuthGuard, SubscriptionGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Interests')
@Controller('interests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class InterestsController {
  constructor(private interestsService: InterestsService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'Express interest (requires subscription)' })
  @ApiResponse({ status: 201, description: 'Interest sent successfully' })
  @ApiResponse({ status: 403, description: 'Subscription required' })
  @ApiResponse({ status: 409, description: 'Interest already sent' })
  async sendInterest(
    @CurrentUser('id') userId: string,
    @Body() dto: SendInterestDto,
  ) {
    return this.interestsService.sendInterest(userId, dto);
  }

  @Put(':id/respond')
  @ApiOperation({ summary: 'Respond to received interest' })
  @ApiParam({ name: 'id', description: 'Interest ID' })
  @ApiResponse({ status: 200, description: 'Response recorded' })
  @ApiResponse({ status: 404, description: 'Interest not found' })
  async respondToInterest(
    @CurrentUser('id') userId: string,
    @Param('id') interestId: string,
    @Body() dto: RespondInterestDto,
  ) {
    return this.interestsService.respondToInterest(userId, interestId, dto);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get sent interests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of sent interests' })
  async getSentInterests(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.interestsService.getSentInterests(userId, +page, +limit);
  }

  @Get('received')
  @ApiOperation({ summary: 'Get received interests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of received interests' })
  async getReceivedInterests(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.interestsService.getReceivedInterests(userId, +page, +limit);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Get mutual matches (both accepted)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of mutual matches' })
  async getMutualMatches(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.interestsService.getMutualMatches(userId, +page, +limit);
  }
}
