import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, PartnerPreferenceDto, SearchProfilesDto } from './dto/profile.dto';
import { Gender, Role, SubscriptionStatus } from '@prisma/client';
export declare class ProfilesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getMyProfile(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<any>;
    updatePartnerPreferences(userId: string, dto: PartnerPreferenceDto): Promise<any>;
    searchProfiles(userId: string, userRole: Role, userGender: Gender, subscriptionStatus: SubscriptionStatus, dto: SearchProfilesDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
            hasMore: boolean;
        };
    }>;
    viewProfile(viewerId: string, profileId: string, viewerRole: Role, subscriptionStatus: SubscriptionStatus): Promise<any>;
    getProfileByUserId(userId: string): Promise<any>;
    updateProfilePicture(userId: string, imageUrl: string): Promise<any>;
    addGalleryImage(userId: string, imageUrl: string, caption?: string): Promise<any>;
    removeGalleryImage(userId: string, imageId: string): Promise<{
        message: string;
    }>;
    private getProfileSelectFields;
    private filterProfileBySubscription;
    private calculateAge;
    private checkProfileCompleteness;
}
