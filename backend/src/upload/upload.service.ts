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
  private readonly baseUrl: string;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    // ✅ Upload directory (local vs Railway)
    this.uploadDir =
      nodeEnv === 'production'
        ? '/data/uploads' // Railway persistent disk
        : path.join(process.cwd(), 'uploads'); // Local dev

    // ✅ Base URL (must be set in production)
    const baseUrl =
      nodeEnv === 'production'
        ? this.configService.get<string>('BASE_URL')
        : 'http://localhost:4000';

    if (nodeEnv === 'production' && !baseUrl) {
      throw new Error('❌ BASE_URL env is required in production');
    }

    this.baseUrl = baseUrl!.replace(/\/$/, '');

    this.ensureUploadDir();
  }

  /* ============================
     DIRECTORY SETUP
  ============================ */

  private ensureUploadDir(): void {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }

      const profilesDir = path.join(this.uploadDir, 'profiles');
      if (!fs.existsSync(profilesDir)) {
        fs.mkdirSync(profilesDir, { recursive: true });
      }
    } catch (err) {
      this.logger.error('Failed to initialize upload directories', err);
      throw new Error('Upload directory initialization failed');
    }
  }

  /* ============================
     PROFILE IMAGE
  ============================ */

  async uploadProfileImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    this.validateFile(file);

    const filename = `${userId}-${uuidv4()}.webp`;
    const filepath = path.join(this.uploadDir, 'profiles', filename);

    try {
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      return `${this.baseUrl}/uploads/profiles/${filename}`;
    } catch (err) {
      this.logger.error('Failed to process profile image', err);
      throw new BadRequestException('Failed to process image');
    }
  }

  /* ============================
     GALLERY IMAGE
  ============================ */

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

      return `${this.baseUrl}/uploads/profiles/${filename}`;
    } catch (err) {
      this.logger.error('Failed to process gallery image', err);
      throw new BadRequestException('Failed to process image');
    }
  }

  /* ============================
     DELETE IMAGE
  ============================ */

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const filename = path.basename(imageUrl);
      const filepath = path.join(this.uploadDir, 'profiles', filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err) {
      this.logger.error('Failed to delete image', err);
    }
  }

  /* ============================
     VALIDATION
  ============================ */

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WebP images are allowed',
      );
    }
  }
}
