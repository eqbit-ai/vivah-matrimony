import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateProfileDto,
  PartnerPreferenceDto,
  SearchProfilesDto,
} from './dto/profile.dto';
import { Gender, Role, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private prisma: PrismaService) {}

  // Get own profile (full details)
  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        gallery: { orderBy: { sortOrder: 'asc' } },
        partnerPreferences: true,
        user: {
          select: {
            email: true,
            isEmailVerified: true,
            createdAt: true,
            subscription: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...profile,
      age: this.calculateAge(profile.dateOfBirth),
    };
  }

  // Update own profile
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
        isComplete: this.checkProfileCompleteness({ ...profile, ...dto }),
      },
      include: {
        gallery: true,
        partnerPreferences: true,
      },
    });

    return updatedProfile;
  }

  // Update partner preferences
  async updatePartnerPreferences(userId: string, dto: PartnerPreferenceDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const preferences = await this.prisma.partnerPreference.upsert({
      where: { profileId: profile.id },
      create: {
        profileId: profile.id,
        ...dto,
      },
      update: dto,
    });

    return preferences;
  }

  // Search profiles (matches based on opposite gender)
  async searchProfiles(
    userId: string,
    userRole: Role,
    userGender: Gender,
    subscriptionStatus: SubscriptionStatus,
    dto: SearchProfilesDto,
  ) {
    const { page = 1, limit = 20, minAge, maxAge, religion, caste, state, city, profession, maritalStatus } = dto;
    const skip = (page - 1) * limit;

    // Determine which gender to show
    const targetGender = userGender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

    // Build where clause
    const where: any = {
      gender: targetGender,
      user: {
        isActive: true,
        id: { not: userId },
      },
    };

    // Age filter
    if (minAge || maxAge) {
      const now = new Date();
      where.dateOfBirth = {};
      
      if (maxAge) {
        const minDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
        where.dateOfBirth.gte = minDate;
      }
      
      if (minAge) {
        const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        where.dateOfBirth.lte = maxDate;
      }
    }

    if (religion) where.religion = religion;
    if (caste) where.caste = { contains: caste, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (profession) where.profession = { contains: profession, mode: 'insensitive' };
    if (maritalStatus) where.maritalStatus = maritalStatus;

    // Get total count
    const total = await this.prisma.profile.count({ where });

    // Get profiles
    const profiles = await this.prisma.profile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: this.getProfileSelectFields(subscriptionStatus, userRole),
    });

    // Transform profiles with age
    const transformedProfiles = profiles.map((profile) => ({
      ...this.filterProfileBySubscription(profile, subscriptionStatus, userRole),
      age: this.calculateAge(profile.dateOfBirth),
    }));

    return {
      data: transformedProfiles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  // View single profile
  async viewProfile(
    viewerId: string,
    profileId: string,
    viewerRole: Role,
    subscriptionStatus: SubscriptionStatus,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        gallery: { orderBy: { sortOrder: 'asc' } },
        user: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!profile || !profile.user.isActive) {
      throw new NotFoundException('Profile not found');
    }

    // Record profile view (only for non-admin users)
    if (viewerRole !== Role.ADMIN && viewerId !== profile.user.id) {
      await this.prisma.profileView.create({
        data: {
          viewerId,
          viewedId: profile.user.id,
        },
      }).catch(() => {
        // Ignore duplicate view errors
      });
    }

    // Filter based on subscription
    const filteredProfile = this.filterProfileBySubscription(
      profile,
      subscriptionStatus,
      viewerRole,
    );

    return {
      ...filteredProfile,
      age: this.calculateAge(profile.dateOfBirth),
    };
  }

  // Get profile by user ID (for admin)
  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        gallery: { orderBy: { sortOrder: 'asc' } },
        partnerPreferences: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
            createdAt: true,
            lastLoginAt: true,
            subscription: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...profile,
      age: this.calculateAge(profile.dateOfBirth),
    };
  }

  // Update profile picture
  async updateProfilePicture(userId: string, imageUrl: string) {
    return this.prisma.profile.update({
      where: { userId },
      data: { profilePicture: imageUrl },
    });
  }

  // Add gallery image
  async addGalleryImage(userId: string, imageUrl: string, caption?: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { gallery: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.gallery.length >= 10) {
      throw new BadRequestException('Maximum 10 gallery images allowed');
    }

    return this.prisma.profileImage.create({
      data: {
        profileId: profile.id,
        imageUrl,
        caption,
        sortOrder: profile.gallery.length,
      },
    });
  }

  // Remove gallery image
  async removeGalleryImage(userId: string, imageId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const image = await this.prisma.profileImage.findFirst({
      where: { id: imageId, profileId: profile.id },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.profileImage.delete({ where: { id: imageId } });

    return { message: 'Image deleted successfully' };
  }

  // Helper: Get select fields based on subscription
  private getProfileSelectFields(status: SubscriptionStatus, role: Role) {
    const basicFields = {
      id: true,
      firstName: true,
      lastName: true,
      gender: true,
      dateOfBirth: true,
      religion: true,
      caste: true,
      city: true,
      state: true,
      profession: true,
      profilePicture: true,
      userId: true,
    };

    // Full access for paid users or admins
    if (status === SubscriptionStatus.PAID || role === Role.ADMIN) {
      return {
        ...basicFields,
        height: true,
        weight: true,
        complexion: true,
        bodyType: true,
        subCaste: true,
        motherTongue: true,
        gothra: true,
        country: true,
        pincode: true,
        education: true,
        educationDetail: true,
        employer: true,
        annualIncome: true,
        workingCity: true,
        fatherName: true,
        fatherOccupation: true,
        motherName: true,
        motherOccupation: true,
        siblings: true,
        familyType: true,
        familyStatus: true,
        familyValues: true,
        maritalStatus: true,
        diet: true,
        smoking: true,
        drinking: true,
        bio: true,
        hobbies: true,
        gallery: true,
        createdAt: true,
      };
    }

    return basicFields;
  }

  // Helper: Filter profile data based on subscription
  private filterProfileBySubscription(
    profile: any,
    status: SubscriptionStatus,
    role: Role,
  ) {
    if (status === SubscriptionStatus.PAID || role === Role.ADMIN) {
      return profile;
    }

    // Free users see limited data
    const { 
      id, 
      firstName, 
      lastName, 
      gender, 
      dateOfBirth,
      religion, 
      caste, 
      city, 
      state, 
      profession, 
      profilePicture 
    } = profile;

    return {
      id,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      religion,
      caste,
      city,
      state,
      profession,
      profilePicture,
      // Indicate that more data is available with subscription
      _requiresSubscription: true,
    };
  }

  // Helper: Calculate age from date of birth
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // Helper: Check if profile is complete
  private checkProfileCompleteness(profile: any): boolean {
    const requiredFields = [
      'firstName',
      'lastName',
      'gender',
      'dateOfBirth',
      'religion',
      'phone',
      'state',
      'city',
      'education',
      'profession',
      'bio',
    ];

    return requiredFields.every((field) => profile[field]);
  }
}
