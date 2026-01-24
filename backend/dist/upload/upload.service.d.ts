import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private readonly logger;
    private readonly uploadDir;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor(configService: ConfigService);
    private ensureUploadDir;
    uploadProfileImage(file: Express.Multer.File, userId: string): Promise<string>;
    uploadGalleryImage(file: Express.Multer.File, userId: string): Promise<string>;
    deleteImage(imageUrl: string): Promise<void>;
    private validateFile;
}
