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
var ProfilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProfilesService = ProfilesService_1 = class ProfilesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ProfilesService_1.name);
    }
    async getMyProfile(userId) {
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
            throw new common_1.NotFoundException('Profile not found');
        }
        return {
            ...profile,
            age: this.calculateAge(profile.dateOfBirth),
        };
    }
    async updateProfile(userId, dto) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
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
    async updatePartnerPreferences(userId, dto) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
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
    async searchProfiles(userId, userRole, userGender, subscriptionStatus, dto) {
        const { page = 1, limit = 20, minAge, maxAge, religion, caste, state, city, profession, maritalStatus } = dto;
        const skip = (page - 1) * limit;
        const targetGender = userGender === client_1.Gender.MALE ? client_1.Gender.FEMALE : client_1.Gender.MALE;
        const where = {
            gender: targetGender,
            user: {
                isActive: true,
                id: { not: userId },
            },
        };
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
        if (religion)
            where.religion = religion;
        if (caste)
            where.caste = { contains: caste, mode: 'insensitive' };
        if (state)
            where.state = { contains: state, mode: 'insensitive' };
        if (city)
            where.city = { contains: city, mode: 'insensitive' };
        if (profession)
            where.profession = { contains: profession, mode: 'insensitive' };
        if (maritalStatus)
            where.maritalStatus = maritalStatus;
        const total = await this.prisma.profile.count({ where });
        const profiles = await this.prisma.profile.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: this.getProfileSelectFields(subscriptionStatus, userRole),
        });
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
    async viewProfile(viewerId, profileId, viewerRole, subscriptionStatus) {
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
            throw new common_1.NotFoundException('Profile not found');
        }
        if (viewerRole !== client_1.Role.ADMIN && viewerId !== profile.user.id) {
            await this.prisma.profileView.create({
                data: {
                    viewerId,
                    viewedId: profile.user.id,
                },
            }).catch(() => {
            });
        }
        const filteredProfile = this.filterProfileBySubscription(profile, subscriptionStatus, viewerRole);
        return {
            ...filteredProfile,
            age: this.calculateAge(profile.dateOfBirth),
        };
    }
    async getProfileByUserId(userId) {
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
            throw new common_1.NotFoundException('Profile not found');
        }
        return {
            ...profile,
            age: this.calculateAge(profile.dateOfBirth),
        };
    }
    async updateProfilePicture(userId, imageUrl) {
        return this.prisma.profile.update({
            where: { userId },
            data: { profilePicture: imageUrl },
        });
    }
    async addGalleryImage(userId, imageUrl, caption) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { gallery: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        if (profile.gallery.length >= 10) {
            throw new common_1.BadRequestException('Maximum 10 gallery images allowed');
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
    async removeGalleryImage(userId, imageId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const image = await this.prisma.profileImage.findFirst({
            where: { id: imageId, profileId: profile.id },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.prisma.profileImage.delete({ where: { id: imageId } });
        return { message: 'Image deleted successfully' };
    }
    getProfileSelectFields(status, role) {
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
        if (status === client_1.SubscriptionStatus.PAID || role === client_1.Role.ADMIN) {
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
    filterProfileBySubscription(profile, status, role) {
        if (status === client_1.SubscriptionStatus.PAID || role === client_1.Role.ADMIN) {
            return profile;
        }
        const { id, firstName, lastName, gender, dateOfBirth, religion, caste, city, state, profession, profilePicture } = profile;
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
            _requiresSubscription: true,
        };
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    checkProfileCompleteness(profile) {
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
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = ProfilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map