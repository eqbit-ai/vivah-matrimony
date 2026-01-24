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
exports.InterestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const interests_service_1 = require("./interests.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let InterestsController = class InterestsController {
    constructor(interestsService) {
        this.interestsService = interestsService;
    }
    async sendInterest(userId, dto) {
        return this.interestsService.sendInterest(userId, dto);
    }
    async respondToInterest(userId, interestId, dto) {
        return this.interestsService.respondToInterest(userId, interestId, dto);
    }
    async getSentInterests(userId, page = 1, limit = 20) {
        return this.interestsService.getSentInterests(userId, +page, +limit);
    }
    async getReceivedInterests(userId, page = 1, limit = 20) {
        return this.interestsService.getReceivedInterests(userId, +page, +limit);
    }
    async getMutualMatches(userId, page = 1, limit = 20) {
        return this.interestsService.getMutualMatches(userId, +page, +limit);
    }
};
exports.InterestsController = InterestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.SubscriptionGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Express interest (requires subscription)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Interest sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Subscription required' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Interest already sent' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "sendInterest", null);
__decorate([
    (0, common_1.Put)(':id/respond'),
    (0, swagger_1.ApiOperation)({ summary: 'Respond to received interest' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Interest ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Response recorded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Interest not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "respondToInterest", null);
__decorate([
    (0, common_1.Get)('sent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sent interests' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sent interests' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "getSentInterests", null);
__decorate([
    (0, common_1.Get)('received'),
    (0, swagger_1.ApiOperation)({ summary: 'Get received interests' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of received interests' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "getReceivedInterests", null);
__decorate([
    (0, common_1.Get)('matches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mutual matches (both accepted)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of mutual matches' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "getMutualMatches", null);
exports.InterestsController = InterestsController = __decorate([
    (0, swagger_1.ApiTags)('Interests'),
    (0, common_1.Controller)('interests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [interests_service_1.InterestsService])
], InterestsController);
//# sourceMappingURL=interests.controller.js.map