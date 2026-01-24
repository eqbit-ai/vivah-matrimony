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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileResponseDto = exports.SearchProfilesDto = exports.PartnerPreferenceDto = exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rahul' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sharma' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 175 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(120),
    (0, class_validator_1.Max)(220),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 70 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Fair' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "complexion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Athletic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bodyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Religion }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Religion),
    __metadata("design:type", typeof (_a = typeof client_1.Religion !== "undefined" && client_1.Religion) === "function" ? _a : Object)
], UpdateProfileDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Brahmin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "caste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sharma' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "subCaste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hindi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "motherTongue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kashyap' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "gothra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'India' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maharashtra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mumbai' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '400001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'Invalid pincode' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'B.Tech Computer Science' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IIT Delhi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "educationDetail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Software Engineer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Google' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "employer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '25-35 LPA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "annualIncome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bangalore' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "workingCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Suresh Sharma' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "fatherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Business' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "fatherOccupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sunita Sharma' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "motherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Homemaker' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "motherOccupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "siblings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Nuclear' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "familyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Upper Middle Class' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "familyStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Moderate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "familyValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MaritalStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MaritalStatus),
    __metadata("design:type", typeof (_b = typeof client_1.MaritalStatus !== "undefined" && client_1.MaritalStatus) === "function" ? _b : Object)
], UpdateProfileDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Vegetarian' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "diet", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Never' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "smoking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Never' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "drinking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'I am a simple person who values family...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Reading', 'Traveling', 'Music'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "hobbies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9876543210' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9876543211' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "alternatePhone", void 0);
class PartnerPreferenceDto {
}
exports.PartnerPreferenceDto = PartnerPreferenceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], PartnerPreferenceDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 35 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], PartnerPreferenceDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 150 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PartnerPreferenceDto.prototype, "minHeight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 180 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PartnerPreferenceDto.prototype, "maxHeight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['HINDU', 'SIKH'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.Religion, { each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "religions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Brahmin', 'Kshatriya'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "castes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['India'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "countries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Maharashtra', 'Gujarat'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "states", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Mumbai', 'Pune'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "cities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Graduate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartnerPreferenceDto.prototype, "minEducation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Doctor', 'Engineer'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "professions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['NEVER_MARRIED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.MaritalStatus, { each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "maritalStatuses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Vegetarian'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PartnerPreferenceDto.prototype, "diets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], PartnerPreferenceDto.prototype, "aboutPartner", void 0);
class SearchProfilesDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.SearchProfilesDto = SearchProfilesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchProfilesDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], SearchProfilesDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 18 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    __metadata("design:type", Number)
], SearchProfilesDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 40 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], SearchProfilesDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Religion }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Religion),
    __metadata("design:type", typeof (_c = typeof client_1.Religion !== "undefined" && client_1.Religion) === "function" ? _c : Object)
], SearchProfilesDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Brahmin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProfilesDto.prototype, "caste", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maharashtra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProfilesDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mumbai' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProfilesDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Software Engineer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchProfilesDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MaritalStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MaritalStatus),
    __metadata("design:type", typeof (_d = typeof client_1.MaritalStatus !== "undefined" && client_1.MaritalStatus) === "function" ? _d : Object)
], SearchProfilesDto.prototype, "maritalStatus", void 0);
class ProfileResponseDto {
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_e = typeof client_1.Gender !== "undefined" && client_1.Gender) === "function" ? _e : Object)
], ProfileResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProfileResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_f = typeof client_1.Religion !== "undefined" && client_1.Religion) === "function" ? _f : Object)
], ProfileResponseDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "caste", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ProfileResponseDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "annualIncome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], ProfileResponseDto.prototype, "gallery", void 0);
//# sourceMappingURL=profile.dto.js.map