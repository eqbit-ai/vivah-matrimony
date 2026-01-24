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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    constructor(adminService, subscriptionsService) {
        this.adminService = adminService;
        this.subscriptionsService = subscriptionsService;
    }
    async getDashboard() {
        return this.adminService.getDashboardMetrics();
    }
    async searchUsers(dto) {
        return this.adminService.searchUsers(dto);
    }
    async getUserDetails(userId) {
        return this.adminService.getUserFullDetails(userId);
    }
    async verifyProfile(adminId, userId) {
        return this.adminService.verifyProfile(adminId, userId);
    }
    async deactivateUser(adminId, userId, reason) {
        return this.adminService.deactivateUser(adminId, userId, reason);
    }
    async reactivateUser(adminId, userId) {
        return this.adminService.reactivateUser(adminId, userId);
    }
    async getAllInterests(page = 1, limit = 20, status) {
        return this.adminService.getAllInterests(+page, +limit, status);
    }
    async scheduleMeeting(adminId, dto) {
        return this.adminService.scheduleMeeting(adminId, dto);
    }
    async getAllSubscriptions(page = 1, limit = 20, status) {
        return this.subscriptionsService.getAllSubscriptions(+page, +limit, status);
    }
    async activateSubscription(userId, days) {
        return this.subscriptionsService.activateSubscription(userId, days);
    }
    async deactivateSubscription(userId) {
        return this.subscriptionsService.deactivateSubscription(userId);
    }
    async getAdminLogs(page = 1, limit = 50) {
        return this.adminService.getAdminLogs(+page, +limit);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated users list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user full details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Put)('users/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user profile' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile verified' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "verifyProfile", null);
__decorate([
    (0, common_1.Put)('users/:id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deactivated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Put)('users/:id/reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User reactivated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reactivateUser", null);
__decorate([
    (0, common_1.Get)('interests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all interests' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.InterestStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated interests list' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllInterests", null);
__decorate([
    (0, common_1.Post)('interests/schedule-meeting'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule meeting for matched users' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Meeting scheduled' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "scheduleMeeting", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscriptions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.SubscriptionStatus }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated subscriptions list' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllSubscriptions", null);
__decorate([
    (0, common_1.Put)('subscriptions/:userId/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually activate subscription' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription activated' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "activateSubscription", null);
__decorate([
    (0, common_1.Put)('subscriptions/:userId/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate subscription' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription deactivated' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deactivateSubscription", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin activity logs' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated logs' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, jwt_auth_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        subscriptions_service_1.SubscriptionsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map