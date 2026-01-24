import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import {
  UpdateProfileDto,
  PartnerPreferenceDto,
  SearchProfilesDto,
} from './dto/profile.dto';
import { JwtAuthGuard, SubscriptionGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Gender, Role, SubscriptionStatus } from '@prisma/client';

@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiResponse({ status: 200, description: 'Profile details' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, dto);
  }

  @Put('me/preferences')
  @ApiOperation({ summary: 'Update partner preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async updatePartnerPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: PartnerPreferenceDto,
  ) {
    return this.profilesService.updatePartnerPreferences(userId, dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search profiles (shows opposite gender)' })
  @ApiResponse({ status: 200, description: 'Paginated profiles list' })
  async searchProfiles(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @CurrentUser('profile') profile: { gender: Gender },
    @CurrentUser('subscription') subscription: { status: SubscriptionStatus },
    @Query() dto: SearchProfilesDto,
  ) {
    return this.profilesService.searchProfiles(
      userId,
      role,
      profile.gender,
      subscription?.status || SubscriptionStatus.FREE,
      dto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'View single profile' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Profile details' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async viewProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @CurrentUser('subscription') subscription: { status: SubscriptionStatus },
    @Param('id') profileId: string,
  ) {
    return this.profilesService.viewProfile(
      userId,
      profileId,
      role,
      subscription?.status || SubscriptionStatus.FREE,
    );
  }

  @Get(':id/full')
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'View full profile (requires subscription)' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Full profile details' })
  @ApiResponse({ status: 403, description: 'Subscription required' })
  async viewFullProfile(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Param('id') profileId: string,
  ) {
    return this.profilesService.viewProfile(
      userId,
      profileId,
      role,
      SubscriptionStatus.PAID,
    );
  }

  @Post('me/gallery')
  @ApiOperation({ summary: 'Add gallery image' })
  @ApiResponse({ status: 201, description: 'Image added' })
  async addGalleryImage(
    @CurrentUser('id') userId: string,
    @Body() body: { imageUrl: string; caption?: string },
  ) {
    return this.profilesService.addGalleryImage(userId, body.imageUrl, body.caption);
  }

  @Delete('me/gallery/:imageId')
  @ApiOperation({ summary: 'Remove gallery image' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image removed' })
  async removeGalleryImage(
    @CurrentUser('id') userId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.profilesService.removeGalleryImage(userId, imageId);
  }
}
