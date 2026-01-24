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
var InterestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
let InterestsService = InterestsService_1 = class InterestsService {
    constructor(prisma, notificationsService, emailService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(InterestsService_1.name);
    }
    async sendInterest(senderId, dto) {
        const sender = await this.prisma.user.findUnique({
            where: { id: senderId },
            include: {
                subscription: true,
                profile: { select: { firstName: true, lastName: true } },
            },
        });
        if (!sender?.subscription || sender.subscription.status !== client_1.SubscriptionStatus.PAID) {
            throw new common_1.ForbiddenException('Paid subscription required to express interest');
        }
        if (sender.subscription.endDate && new Date(sender.subscription.endDate) < new Date()) {
            throw new common_1.ForbiddenException('Your subscription has expired');
        }
        const receiver = await this.prisma.user.findUnique({
            where: { id: dto.receiverId, isActive: true },
            include: { profile: { select: { firstName: true, lastName: true } } },
        });
        if (!receiver)
            throw new common_1.NotFoundException('User not found');
        if (senderId === dto.receiverId)
            throw new common_1.BadRequestException('Cannot express interest to yourself');
        const existingInterest = await this.prisma.interest.findUnique({
            where: { senderId_receiverId: { senderId, receiverId: dto.receiverId } },
        });
        if (existingInterest)
            throw new common_1.ConflictException('Interest already sent');
        const interest = await this.prisma.interest.create({
            data: { senderId, receiverId: dto.receiverId, message: dto.message, status: client_1.InterestStatus.PENDING },
        });
        await this.prisma.subscription.update({
            where: { userId: senderId },
            data: { interestsSent: { increment: 1 } },
        });
        await this.notificationsService.createNotification({
            userId: dto.receiverId,
            type: client_1.NotificationType.INTEREST_RECEIVED,
            title: 'New Interest Received!',
            message: `${sender.profile?.firstName} ${sender.profile?.lastName} has expressed interest in your profile.`,
            data: { interestId: interest.id, senderId },
        });
        await this.notifyAdminsOfInterest(interest.id, sender, receiver);
        return { message: 'Interest expressed successfully', interest };
    }
    async respondToInterest(userId, interestId, dto) {
        const interest = await this.prisma.interest.findUnique({
            where: { id: interestId },
            include: {
                sender: { include: { profile: { select: { firstName: true, lastName: true } } } },
                receiver: { include: { profile: { select: { firstName: true, lastName: true } } } },
            },
        });
        if (!interest)
            throw new common_1.NotFoundException('Interest not found');
        if (interest.receiverId !== userId)
            throw new common_1.ForbiddenException('Unauthorized');
        if (interest.status !== client_1.InterestStatus.PENDING)
            throw new common_1.BadRequestException('Already responded');
        const updatedInterest = await this.prisma.interest.update({
            where: { id: interestId },
            data: {
                status: dto.status === 'ACCEPTED' ? client_1.InterestStatus.ACCEPTED : client_1.InterestStatus.REJECTED,
                respondedAt: new Date(),
            },
        });
        const notificationType = dto.status === 'ACCEPTED' ? client_1.NotificationType.INTEREST_ACCEPTED : client_1.NotificationType.INTEREST_REJECTED;
        await this.notificationsService.createNotification({
            userId: interest.senderId,
            type: notificationType,
            title: dto.status === 'ACCEPTED' ? 'Interest Accepted!' : 'Interest Response',
            message: dto.status === 'ACCEPTED'
                ? `${interest.receiver.profile?.firstName} has accepted your interest!`
                : `${interest.receiver.profile?.firstName} has responded to your interest.`,
            data: { interestId: interest.id },
        });
        return { message: `Interest ${dto.status.toLowerCase()} successfully`, interest: updatedInterest };
    }
    async getSentInterests(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [interests, total] = await Promise.all([
            this.prisma.interest.findMany({
                where: { senderId: userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    receiver: {
                        include: {
                            profile: {
                                select: { id: true, firstName: true, lastName: true, profilePicture: true, profession: true, city: true, state: true, dateOfBirth: true },
                            },
                        },
                    },
                },
            }),
            this.prisma.interest.count({ where: { senderId: userId } }),
        ]);
        return {
            data: interests.map((i) => ({
                ...i,
                receiver: {
                    ...i.receiver,
                    profile: i.receiver.profile ? { ...i.receiver.profile, age: this.calculateAge(i.receiver.profile.dateOfBirth) } : null,
                },
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getReceivedInterests(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [interests, total] = await Promise.all([
            this.prisma.interest.findMany({
                where: { receiverId: userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        include: {
                            profile: {
                                select: { id: true, firstName: true, lastName: true, profilePicture: true, profession: true, city: true, state: true, dateOfBirth: true },
                            },
                        },
                    },
                },
            }),
            this.prisma.interest.count({ where: { receiverId: userId } }),
        ]);
        return {
            data: interests.map((i) => ({
                ...i,
                sender: {
                    ...i.sender,
                    profile: i.sender.profile ? { ...i.sender.profile, age: this.calculateAge(i.sender.profile.dateOfBirth) } : null,
                },
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getMutualMatches(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [matches, total] = await Promise.all([
            this.prisma.interest.findMany({
                where: {
                    OR: [
                        { senderId: userId, status: client_1.InterestStatus.ACCEPTED },
                        { receiverId: userId, status: client_1.InterestStatus.ACCEPTED },
                    ],
                },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
                include: {
                    sender: { include: { profile: { select: { id: true, firstName: true, lastName: true, profilePicture: true, profession: true, city: true } } } },
                    receiver: { include: { profile: { select: { id: true, firstName: true, lastName: true, profilePicture: true, profession: true, city: true } } } },
                },
            }),
            this.prisma.interest.count({
                where: {
                    OR: [
                        { senderId: userId, status: client_1.InterestStatus.ACCEPTED },
                        { receiverId: userId, status: client_1.InterestStatus.ACCEPTED },
                    ],
                },
            }),
        ]);
        const matchedProfiles = matches.map((m) => {
            const matchedUser = m.senderId === userId ? m.receiver : m.sender;
            return { interestId: m.id, matchedAt: m.respondedAt, user: matchedUser };
        });
        return { data: matchedProfiles, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async notifyAdminsOfInterest(interestId, sender, receiver) {
        const admins = await this.prisma.user.findMany({ where: { role: client_1.Role.ADMIN, isActive: true } });
        for (const admin of admins) {
            await this.notificationsService.createNotification({
                userId: admin.id,
                type: client_1.NotificationType.ADMIN_MESSAGE,
                title: 'New Interest Expressed',
                message: `${sender.profile?.firstName} ${sender.profile?.lastName} has expressed interest in ${receiver.profile?.firstName} ${receiver.profile?.lastName}`,
                data: { interestId, senderId: sender.id, receiverId: receiver.id },
            });
        }
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
exports.InterestsService = InterestsService;
exports.InterestsService = InterestsService = InterestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], InterestsService);
//# sourceMappingURL=interests.service.js.map