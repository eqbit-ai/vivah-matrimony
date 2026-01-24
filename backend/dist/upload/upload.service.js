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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const uuid_1 = require("uuid");
let UploadService = UploadService_1 = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(UploadService_1.name);
        this.maxFileSize = 5 * 1024 * 1024;
        this.allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
        this.ensureUploadDir();
    }
    ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
        const profilesDir = path.join(this.uploadDir, 'profiles');
        if (!fs.existsSync(profilesDir)) {
            fs.mkdirSync(profilesDir, { recursive: true });
        }
    }
    async uploadProfileImage(file, userId) {
        this.validateFile(file);
        const filename = `${userId}-${(0, uuid_1.v4)()}.webp`;
        const filepath = path.join(this.uploadDir, 'profiles', filename);
        try {
            await sharp(file.buffer)
                .resize(800, 800, {
                fit: 'cover',
                position: 'center',
            })
                .webp({ quality: 85 })
                .toFile(filepath);
            const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:4000';
            return `${baseUrl}/uploads/profiles/${filename}`;
        }
        catch (error) {
            this.logger.error('Failed to process image', error);
            throw new common_1.BadRequestException('Failed to process image');
        }
    }
    async uploadGalleryImage(file, userId) {
        this.validateFile(file);
        const filename = `${userId}-gallery-${(0, uuid_1.v4)()}.webp`;
        const filepath = path.join(this.uploadDir, 'profiles', filename);
        try {
            await sharp(file.buffer)
                .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .webp({ quality: 85 })
                .toFile(filepath);
            const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:4000';
            return `${baseUrl}/uploads/profiles/${filename}`;
        }
        catch (error) {
            this.logger.error('Failed to process gallery image', error);
            throw new common_1.BadRequestException('Failed to process image');
        }
    }
    async deleteImage(imageUrl) {
        try {
            const filename = path.basename(imageUrl);
            const filepath = path.join(this.uploadDir, 'profiles', filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        catch (error) {
            this.logger.error('Failed to delete image', error);
        }
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size exceeds 5MB limit');
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only JPEG, PNG, and WebP images are allowed');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map