import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { ProfilesService } from '../profiles/profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private profilesService: ProfilesService,
  ) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async uploadProfilePicture(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const imageUrl = await this.uploadService.uploadProfileImage(file, userId);
    await this.profilesService.updateProfilePicture(userId, imageUrl);

    return { imageUrl };
  }

  @Post('gallery')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload gallery image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        caption: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async uploadGalleryImage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const imageUrl = await this.uploadService.uploadGalleryImage(file, userId);
    const image = await this.profilesService.addGalleryImage(userId, imageUrl);

    return image;
  }
}
