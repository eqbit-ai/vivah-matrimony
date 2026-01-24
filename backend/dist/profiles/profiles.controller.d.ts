import { ProfilesService } from './profiles.service';
import { UpdateProfileDto, PartnerPreferenceDto, SearchProfilesDto } from './dto/profile.dto';
import { Gender, Role, SubscriptionStatus } from '@prisma/client';
export declare class ProfilesController {
    private profilesService;
    constructor(profilesService: ProfilesService);
    getMyProfile(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<any>;
    updatePartnerPreferences(userId: string, dto: PartnerPreferenceDto): Promise<any>;
    searchProfiles(userId: string, role: Role, profile: {
        gender: Gender;
    }, subscription: {
        status: SubscriptionStatus;
    }, dto: SearchProfilesDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
            hasMore: boolean;
        };
    }>;
    viewProfile(userId: string, role: Role, subscription: {
        status: SubscriptionStatus;
    }, profileId: string): Promise<any>;
    viewFullProfile(userId: string, role: Role, profileId: string): Promise<any>;
    addGalleryImage(userId: string, body: {
        imageUrl: string;
        caption?: string;
    }): Promise<any>;
    removeGalleryImage(userId: string, imageId: string): Promise<{
        message: string;
    }>;
}
