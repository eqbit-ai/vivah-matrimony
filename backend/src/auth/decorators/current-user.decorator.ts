import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Get current user from request
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

// Roles decorator
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

// Public route decorator - bypasses authentication
export const Public = () => SetMetadata('isPublic', true);

// Requires subscription decorator
export const RequiresSubscription = () => SetMetadata('requiresSubscription', true);
