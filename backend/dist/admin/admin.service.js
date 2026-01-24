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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma, emailService, notificationsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async getDashboardMetrics() {
        const [totalUsers, maleProfiles, femaleProfiles, totalInterests, pendingInterests, acceptedInterests, paidSubscriptions, recentUsers, recentInterests,] = await Promise.all([
            this.prisma.user.count({ where: { role: client_1.Role.USER, isActive: true } }),
            this.prisma.profile.count({ where: { gender: client_1.Gender.MALE, user: { isActive: true } } }),
            this.prisma.profile.count({ where: { gender: client_1.Gender.FEMALE, user: { isActive: true } } }),
            this.prisma.interest.count(),
            this.prisma.interest.count({ where: { status: client_1.InterestStatus.PENDING } }),
            this.prisma.interest.count({ where: { status: client_1.InterestStatus.ACCEPTED } }),
            this.prisma.subscription.count({ where: { status: client_1.SubscriptionStatus.PAID } }),
            this.prisma.user.findMany({
                where: { role: client_1.Role.USER },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { profile: { select: { firstName: true, lastName: true, profilePicture: true } } },
            }),
            this.prisma.interest.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    sender: { include: { profile: { select: { firstName: true, lastName: true } } } },
                    receiver: { include: { profile: { select: { firstName: true, lastName: true } } } },
                },
            }),
        ]);
        return {
            metrics: {
                totalUsers,
                maleProfiles,
                femaleProfiles,
                totalInterests,
                pendingInterests,
                acceptedInterests,
                paidSubscriptions,
                freeUsers: totalUsers - paidSubscriptions,
            },
            recentUsers,
            recentInterests,
        };
    }
    async searchUsers(dto) {
        const { page = 1, limit = 20, gender, religion, caste, minAge, maxAge, state, city, subscriptionStatus, search } = dto;
        const skip = (page - 1) * limit;
        const where = { role: client_1.Role.USER };
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { profile: { firstName: { contains: search, mode: 'insensitive' } } },
                { profile: { lastName: { contains: search, mode: 'insensitive' } } },
                { profile: { phone: { contains: search } } },
            ];
        }
        if (gender || religion || caste || state || city || minAge || maxAge) {
            where.profile = {};
            if (gender)
                where.profile.gender = gender;
            if (religion)
                where.profile.religion = religion;
            if (caste)
                where.profile.caste = { contains: caste, mode: 'insensitive' };
            if (state)
                where.profile.state = { contains: state, mode: 'insensitive' };
            if (city)
                where.profile.city = { contains: city, mode: 'insensitive' };
            if (minAge || maxAge) {
                const now = new Date();
                where.profile.dateOfBirth = {};
                if (maxAge) {
                    where.profile.dateOfBirth.gte = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
                }
                if (minAge) {
                    where.profile.dateOfBirth.lte = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
                }
            }
        }
        if (subscriptionStatus) {
            where.subscription = { status: subscriptionStatus };
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    profile: true,
                    subscription: { select: { status: true, endDate: true } },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users.map((u) => ({
                ...u,
                profile: u.profile ? { ...u.profile, age: this.calculateAge(u.profile.dateOfBirth) } : null,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getUserFullDetails(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: {
                    include: { gallery: true, partnerPreferences: true },
                },
                subscription: true,
                sentInterests: {
                    include: {
                        receiver: { include: { profile: { select: { firstName: true, lastName: true } } } },
                    },
                },
                receivedInterests: {
                    include: {
                        sender: { include: { profile: { select: { firstName: true, lastName: true } } } },
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            ...user,
            profile: user.profile ? { ...user.profile, age: this.calculateAge(user.profile.dateOfBirth) } : null,
        };
    }
    async getAllInterests(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [interests, total] = await Promise.all([
            this.prisma.interest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        include: {
                            profile: {
                                select: { firstName: true, lastName: true, phone: true, city: true, profession: true, dateOfBirth: true, profilePicture: true },
                            },
                        },
                    },
                    receiver: {
                        include: {
                            profile: {
                                select: { firstName: true, lastName: true, phone: true, city: true, profession: true, dateOfBirth: true, profilePicture: true },
                            },
                        },
                    },
                },
            }),
            this.prisma.interest.count({ where }),
        ]);
        return {
            data: interests.map((i) => ({
                ...i,
                sender: {
                    ...i.sender,
                    profile: i.sender.profile ? { ...i.sender.profile, age: this.calculateAge(i.sender.profile.dateOfBirth) } : null,
                },
                receiver: {
                    ...i.receiver,
                    profile: i.receiver.profile ? { ...i.receiver.profile, age: this.calculateAge(i.receiver.profile.dateOfBirth) } : null,
                },
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async scheduleMeeting(adminId, dto) {
        const interest = await this.prisma.interest.findUnique({
            where: { id: dto.interestId },
            include: {
                sender: { include: { profile: { select: { firstName: true, lastName: true, phone: true } } } },
                receiver: { include: { profile: { select: { firstName: true, lastName: true, phone: true } } } },
            },
        });
        if (!interest)
            throw new common_1.NotFoundException('Interest not found');
        if (interest.status !== client_1.InterestStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Can only schedule meetings for accepted interests');
        }
        const updatedInterest = await this.prisma.interest.update({
            where: { id: dto.interestId },
            data: {
                meetingScheduled: true,
                meetingDate: new Date(dto.meetingDate),
                meetingVenue: dto.meetingVenue,
                meetingNotes: dto.meetingNotes,
            },
        });
        await this.prisma.adminLog.create({
            data: {
                adminId,
                action: 'SCHEDULE_MEETING',
                entity: 'Interest',
                entityId: dto.interestId,
                details: { meetingDate: dto.meetingDate, meetingVenue: dto.meetingVenue },
            },
        });
        for (const user of [interest.sender, interest.receiver]) {
            await this.notificationsService.createNotification({
                userId: user.id,
                type: client_1.NotificationType.MEETING_SCHEDULED,
                title: 'Meeting Scheduled!',
                message: `A meeting has been scheduled for ${new Date(dto.meetingDate).toLocaleDateString()} at ${dto.meetingVenue}`,
                data: { interestId: dto.interestId, meetingDate: dto.meetingDate, meetingVenue: dto.meetingVenue },
            });
        }
        await this.emailService.sendMeetingInvitation(interest.sender.email, `${interest.sender.profile?.firstName} ${interest.sender.profile?.lastName}`, `${interest.receiver.profile?.firstName} ${interest.receiver.profile?.lastName}`, new Date(dto.meetingDate), dto.meetingVenue);
        await this.emailService.sendMeetingInvitation(interest.receiver.email, `${interest.receiver.profile?.firstName} ${interest.receiver.profile?.lastName}`, `${interest.sender.profile?.firstName} ${interest.sender.profile?.lastName}`, new Date(dto.meetingDate), dto.meetingVenue);
        return { message: 'Meeting scheduled successfully', interest: updatedInterest };
    }
    async verifyProfile(adminId, userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        await this.prisma.profile.update({
            where: { userId },
            data: { isVerified: true, verifiedAt: new Date(), verifiedBy: adminId },
        });
        await this.prisma.adminLog.create({
            data: { adminId, action: 'VERIFY_PROFILE', entity: 'Profile', entityId: profile.id },
        });
        return { message: 'Profile verified successfully' };
    }
    async deactivateUser(adminId, userId, reason) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });
        await this.prisma.adminLog.create({
            data: {
                adminId,
                action: 'DEACTIVATE_USER',
                entity: 'User',
                entityId: userId,
                details: { reason },
            },
        });
        return { message: 'User deactivated successfully' };
    }
    async reactivateUser(adminId, userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: true },
        });
        await this.prisma.adminLog.create({
            data: { adminId, action: 'REACTIVATE_USER', entity: 'User', entityId: userId },
        });
        return { message: 'User reactivated successfully' };
    }
    async getAdminLogs(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            this.prisma.adminLog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.adminLog.count(),
        ]);
        return { data: logs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()))
            age--;
        return age;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map