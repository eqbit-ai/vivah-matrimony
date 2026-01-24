import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Role, SubscriptionStatus } from '@prisma/client';

// JWT Auth Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Please login to access this resource');
    }
    return user;
  }
}

// Roles Guard
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}

// Admin Guard
@Injectable()
export class AdminGuard {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}

// Subscription Guard - Requires paid subscription
@Injectable()
export class SubscriptionGuard {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    // Admins bypass subscription check
    if (user.role === Role.ADMIN) {
      return true;
    }

    const subscription = user.subscription;

    if (!subscription || subscription.status !== SubscriptionStatus.PAID) {
      throw new ForbiddenException(
        'This feature requires a paid subscription. Please upgrade your plan.',
      );
    }

    // Check if subscription has expired
    if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
      throw new ForbiddenException(
        'Your subscription has expired. Please renew to continue.',
      );
    }

    return true;
  }
}

// Optional Auth Guard - Allows both authenticated and unauthenticated requests
@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    return user || null;
  }
}
