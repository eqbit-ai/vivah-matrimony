import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfileViews(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [views, total] = await Promise.all([
      this.prisma.profileView.findMany({
        where: { viewedId: userId },
        skip,
        take: limit,
        orderBy: { viewedAt: 'desc' },
        include: {
          viewer: {
            include: {
              profile: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                  profession: true,
                  city: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.profileView.count({ where: { viewedId: userId } }),
    ]);

    return {
      data: views,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteAccount(userId: string) {
    // Soft delete - deactivate account
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'Account deactivated successfully' };
  }
}
