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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const profiles_service_1 = require("./profiles.service");
const profile_dto_1 = require("./dto/profile.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let ProfilesController = class ProfilesController {
    constructor(profilesService) {
        this.profilesService = profilesService;
    }
    async getMyProfile(userId) {
        return this.profilesService.getMyProfile(userId);
    }
    async updateProfile(userId, dto) {
        return this.profilesService.updateProfile(userId, dto);
    }
    async updatePartnerPreferences(userId, dto) {
        return this.profilesService.updatePartnerPreferences(userId, dto);
    }
    async searchProfiles(userId, role, profile, subscription, dto) {
        return this.profilesService.searchProfiles(userId, role, profile.gender, subscription?.status || client_1.SubscriptionStatus.FREE, dto);
    }
    async viewProfile(userId, role, subscription, profileId) {
        return this.profilesService.viewProfile(userId, profileId, role, subscription?.status || client_1.SubscriptionStatus.FREE);
    }
    async viewFullProfile(userId, role, profileId) {
        return this.profilesService.viewProfile(userId, profileId, role, client_1.SubscriptionStatus.PAID);
    }
    async addGalleryImage(userId, body) {
        return this.profilesService.addGalleryImage(userId, body.imageUrl, body.caption);
    }
    async removeGalleryImage(userId, imageId) {
        return this.profilesService.removeGalleryImage(userId, imageId);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get own profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update own profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('me/preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update partner preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, profile_dto_1.PartnerPreferenceDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updatePartnerPreferences", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search profiles (shows opposite gender)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated profiles list' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('profile')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('subscription')),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.Role !== "undefined" && client_1.Role) === "function" ? _a : Object, Object, Object, profile_dto_1.SearchProfilesDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "searchProfiles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'View single profile' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('subscription')),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof client_1.Role !== "undefined" && client_1.Role) === "function" ? _b : Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "viewProfile", null);
__decorate([
    (0, common_1.Get)(':id/full'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.SubscriptionGuard),
    (0, swagger_1.ApiOperation)({ summary: 'View full profile (requires subscription)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Full profile details' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Subscription required' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof client_1.Role !== "undefined" && client_1.Role) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "viewFullProfile", null);
__decorate([
    (0, common_1.Post)('me/gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Add gallery image' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image added' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "addGalleryImage", null);
__decorate([
    (0, common_1.Delete)('me/gallery/:imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove gallery image' }),
    (0, swagger_1.ApiParam)({ name: 'imageId', description: 'Image ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image removed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "removeGalleryImage", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, common_1.Controller)('profiles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map