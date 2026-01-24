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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalAuthGuard = exports.SubscriptionGuard = exports.AdminGuard = exports.RolesGuard = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Please login to access this resource');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!requiredRoles.includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to access this resource');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const { user } = context.switchToHttp().getRequest();
        if (!user || user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
let SubscriptionGuard = class SubscriptionGuard {
    canActivate(context) {
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.UnauthorizedException('Please login to access this resource');
        }
        if (user.role === client_1.Role.ADMIN) {
            return true;
        }
        const subscription = user.subscription;
        if (!subscription || subscription.status !== client_1.SubscriptionStatus.PAID) {
            throw new common_1.ForbiddenException('This feature requires a paid subscription. Please upgrade your plan.');
        }
        if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
            throw new common_1.ForbiddenException('Your subscription has expired. Please renew to continue.');
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)()
], SubscriptionGuard);
let OptionalAuthGuard = class OptionalAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        return user || null;
    }
};
exports.OptionalAuthGuard = OptionalAuthGuard;
exports.OptionalAuthGuard = OptionalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map