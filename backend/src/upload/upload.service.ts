import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    const profilesDir = path.join(this.uploadDir, 'profiles');
    if (!fs.existsSync(profilesDir)) {
      fs.mkdirSync(profilesDir, { recursive: true });
    }
  }

  async uploadProfileImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    this.validateFile(file);

    const filename = `${userId}-${uuidv4()}.webp`;
    const filepath = path.join(this.uploadDir, 'profiles', filename);

    try {
      // Process and optimize image
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:4000';
      return `${baseUrl}/uploads/profiles/${filename}`;
    } catch (error) {
      this.logger.error('Failed to process image', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async uploadGalleryImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    this.validateFile(file);

    const filename = `${userId}-gallery-${uuidv4()}.webp`;
    const filepath = path.join(this.uploadDir, 'profiles', filename);

    try {
      await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:4000';
      return `${baseUrl}/uploads/profiles/${filename}`;
    } catch (error) {
      this.logger.error('Failed to process gallery image', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const filename = path.basename(imageUrl);
      const filepath = path.join(this.uploadDir, 'profiles', filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      this.logger.error('Failed to delete image', error);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }
  }
}
