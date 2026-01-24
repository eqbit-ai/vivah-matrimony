import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { InterestStatus, SubscriptionStatus, NotificationType, Role } from '@prisma/client';

export interface SendInterestDto {
  receiverId: string;
  message?: string;
}

export interface RespondInterestDto {
  status: 'ACCEPTED' | 'REJECTED';
}

@Injectable()
export class InterestsService {
  private readonly logger = new Logger(InterestsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  async sendInterest(senderId: string, dto: SendInterestDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      include: {
        subscription: true,
        profile: { select: { firstName: true, lastName: true } },
      },
    });

    if (!sender?.subscription || sender.subscription.status !== SubscriptionStatus.PAID) {
      throw new ForbiddenException('Paid subscription required to express interest');
    }

    if (sender.subscription.endDate && new Date(sender.subscription.endDate) < new Date()) {
      throw new ForbiddenException('Your subscription has expired');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId, isActive: true },
      include: { profile: { select: { firstName: true, lastName: true } } },
    });

    if (!receiver) throw new NotFoundException('User not found');
    if (senderId === dto.receiverId) throw new BadRequestException('Cannot express interest to yourself');

    const existingInterest = await this.prisma.interest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId: dto.receiverId } },
    });

    if (existingInterest) throw new ConflictException('Interest already sent');

    const interest = await this.prisma.interest.create({
      data: { senderId, receiverId: dto.receiverId, message: dto.message, status: InterestStatus.PENDING },
    });

    await this.prisma.subscription.update({
      where: { userId: senderId },
      data: { interestsSent: { increment: 1 } },
    });

    await this.notificationsService.createNotification({
      userId: dto.receiverId,
      type: NotificationType.INTEREST_RECEIVED,
      title: 'New Interest Received!',
      message: `${sender.profile?.firstName} ${sender.profile?.lastName} has expressed interest in your profile.`,
      data: { interestId: interest.id, senderId },
    });

    await this.notifyAdminsOfInterest(interest.id, sender, receiver);

    return { message: 'Interest expressed successfully', interest };
  }

  async respondToInterest(userId: string, interestId: string, dto: RespondInterestDto) {
    const interest = await this.prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        sender: { include: { profile: { select: { firstName: true, lastName: true } } } },
        receiver: { include: { profile: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!interest) throw new NotFoundException('Interest not found');
    if (interest.receiverId !== userId) throw new ForbiddenException('Unauthorized');
    if (interest.status !== InterestStatus.PENDING) throw new BadRequestException('Already responded');

    const updatedInterest = await this.prisma.interest.update({
      where: { id: interestId },
      data: {
        status: dto.status === 'ACCEPTED' ? InterestStatus.ACCEPTED : InterestStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    const notificationType = dto.status === 'ACCEPTED' ? NotificationType.INTEREST_ACCEPTED : NotificationType.INTEREST_REJECTED;

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

  async getSentInterests(userId: string, page = 1, limit = 20) {
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

  async getReceivedInterests(userId: string, page = 1, limit = 20) {
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

  async getMutualMatches(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      this.prisma.interest.findMany({
        where: {
          OR: [
            { senderId: userId, status: InterestStatus.ACCEPTED },
            { receiverId: userId, status: InterestStatus.ACCEPTED },
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
            { senderId: userId, status: InterestStatus.ACCEPTED },
            { receiverId: userId, status: InterestStatus.ACCEPTED },
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

  private async notifyAdminsOfInterest(interestId: string, sender: any, receiver: any) {
    const admins = await this.prisma.user.findMany({ where: { role: Role.ADMIN, isActive: true } });

    for (const admin of admins) {
      await this.notificationsService.createNotification({
        userId: admin.id,
        type: NotificationType.ADMIN_MESSAGE,
        title: 'New Interest Expressed',
        message: `${sender.profile?.firstName} ${sender.profile?.lastName} has expressed interest in ${receiver.profile?.firstName} ${receiver.profile?.lastName}`,
        data: { interestId, senderId: sender.id, receiverId: receiver.id },
      });
    }
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }
}
