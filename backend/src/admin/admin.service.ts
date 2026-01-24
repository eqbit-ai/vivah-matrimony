import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Gender, Religion, InterestStatus, SubscriptionStatus, NotificationType, Role } from '@prisma/client';

export interface AdminSearchUsersDto {
  page?: number;
  limit?: number;
  gender?: Gender;
  religion?: Religion;
  caste?: string;
  minAge?: number;
  maxAge?: number;
  state?: string;
  city?: string;
  subscriptionStatus?: SubscriptionStatus;
  search?: string;
}

export interface ScheduleMeetingDto {
  interestId: string;
  meetingDate: string;
  meetingVenue: string;
  meetingNotes?: string;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  // Dashboard metrics
  async getDashboardMetrics() {
    const [
      totalUsers,
      maleProfiles,
      femaleProfiles,
      totalInterests,
      pendingInterests,
      acceptedInterests,
      paidSubscriptions,
      recentUsers,
      recentInterests,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.USER, isActive: true } }),
      this.prisma.profile.count({ where: { gender: Gender.MALE, user: { isActive: true } } }),
      this.prisma.profile.count({ where: { gender: Gender.FEMALE, user: { isActive: true } } }),
      this.prisma.interest.count(),
      this.prisma.interest.count({ where: { status: InterestStatus.PENDING } }),
      this.prisma.interest.count({ where: { status: InterestStatus.ACCEPTED } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.PAID } }),
      this.prisma.user.findMany({
        where: { role: Role.USER },
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

  // Search users with filters
  async searchUsers(dto: AdminSearchUsersDto) {
    const { page = 1, limit = 20, gender, religion, caste, minAge, maxAge, state, city, subscriptionStatus, search } = dto;
    const skip = (page - 1) * limit;

    const where: any = { role: Role.USER };

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
      if (gender) where.profile.gender = gender;
      if (religion) where.profile.religion = religion;
      if (caste) where.profile.caste = { contains: caste, mode: 'insensitive' };
      if (state) where.profile.state = { contains: state, mode: 'insensitive' };
      if (city) where.profile.city = { contains: city, mode: 'insensitive' };

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

  // Get user full details (including contact info)
  async getUserFullDetails(userId: string) {
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

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      profile: user.profile ? { ...user.profile, age: this.calculateAge(user.profile.dateOfBirth) } : null,
    };
  }

  // Get all interests
  async getAllInterests(page = 1, limit = 20, status?: InterestStatus) {
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

  // Schedule meeting
  async scheduleMeeting(adminId: string, dto: ScheduleMeetingDto) {
    const interest = await this.prisma.interest.findUnique({
      where: { id: dto.interestId },
      include: {
        sender: { include: { profile: { select: { firstName: true, lastName: true, phone: true } } } },
        receiver: { include: { profile: { select: { firstName: true, lastName: true, phone: true } } } },
      },
    });

    if (!interest) throw new NotFoundException('Interest not found');
    if (interest.status !== InterestStatus.ACCEPTED) {
      throw new BadRequestException('Can only schedule meetings for accepted interests');
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

    // Log admin action
    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: 'SCHEDULE_MEETING',
        entity: 'Interest',
        entityId: dto.interestId,
        details: { meetingDate: dto.meetingDate, meetingVenue: dto.meetingVenue },
      },
    });

    // Notify both users
    for (const user of [interest.sender, interest.receiver]) {
      await this.notificationsService.createNotification({
        userId: user.id,
        type: NotificationType.MEETING_SCHEDULED,
        title: 'Meeting Scheduled!',
        message: `A meeting has been scheduled for ${new Date(dto.meetingDate).toLocaleDateString()} at ${dto.meetingVenue}`,
        data: { interestId: dto.interestId, meetingDate: dto.meetingDate, meetingVenue: dto.meetingVenue },
      });
    }

    // Send email invitations
    await this.emailService.sendMeetingInvitation(
      interest.sender.email,
      `${interest.sender.profile?.firstName} ${interest.sender.profile?.lastName}`,
      `${interest.receiver.profile?.firstName} ${interest.receiver.profile?.lastName}`,
      new Date(dto.meetingDate),
      dto.meetingVenue,
    );

    await this.emailService.sendMeetingInvitation(
      interest.receiver.email,
      `${interest.receiver.profile?.firstName} ${interest.receiver.profile?.lastName}`,
      `${interest.sender.profile?.firstName} ${interest.sender.profile?.lastName}`,
      new Date(dto.meetingDate),
      dto.meetingVenue,
    );

    return { message: 'Meeting scheduled successfully', interest: updatedInterest };
  }

  // Verify user profile
  async verifyProfile(adminId: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    await this.prisma.profile.update({
      where: { userId },
      data: { isVerified: true, verifiedAt: new Date(), verifiedBy: adminId },
    });

    await this.prisma.adminLog.create({
      data: { adminId, action: 'VERIFY_PROFILE', entity: 'Profile', entityId: profile.id },
    });

    return { message: 'Profile verified successfully' };
  }

  // Deactivate user
  async deactivateUser(adminId: string, userId: string, reason: string) {
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

  // Reactivate user
  async reactivateUser(adminId: string, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    await this.prisma.adminLog.create({
      data: { adminId, action: 'REACTIVATE_USER', entity: 'User', entityId: userId },
    });

    return { message: 'User reactivated successfully' };
  }

  // Get admin logs
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

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }
}
