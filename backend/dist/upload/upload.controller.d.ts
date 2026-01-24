import { UploadService } from './upload.service';
import { ProfilesService } from '../profiles/profiles.service';
export declare class UploadController {
    private uploadService;
    private profilesService;
    constructor(uploadService: UploadService, profilesService: ProfilesService);
    uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
    uploadGalleryImage(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        sortOrder: number;
        profileId: string;
        imageUrl: string;
        isPrimary: boolean;
        caption: string | null;
    }>;
}
