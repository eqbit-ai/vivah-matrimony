import { Gender, Religion, MaritalStatus } from '@prisma/client';
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    height?: number;
    weight?: number;
    complexion?: string;
    bodyType?: string;
    religion?: Religion;
    caste?: string;
    subCaste?: string;
    motherTongue?: string;
    gothra?: string;
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    education?: string;
    educationDetail?: string;
    profession?: string;
    employer?: string;
    annualIncome?: string;
    workingCity?: string;
    fatherName?: string;
    fatherOccupation?: string;
    motherName?: string;
    motherOccupation?: string;
    siblings?: number;
    familyType?: string;
    familyStatus?: string;
    familyValues?: string;
    maritalStatus?: MaritalStatus;
    diet?: string;
    smoking?: string;
    drinking?: string;
    bio?: string;
    hobbies?: string[];
    phone?: string;
    alternatePhone?: string;
}
export declare class PartnerPreferenceDto {
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    religions?: Religion[];
    castes?: string[];
    countries?: string[];
    states?: string[];
    cities?: string[];
    minEducation?: string;
    professions?: string[];
    maritalStatuses?: MaritalStatus[];
    diets?: string[];
    aboutPartner?: string;
}
export declare class SearchProfilesDto {
    page?: number;
    limit?: number;
    minAge?: number;
    maxAge?: number;
    religion?: Religion;
    caste?: string;
    state?: string;
    city?: string;
    profession?: string;
    maritalStatus?: MaritalStatus;
}
export declare class ProfileResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    age: number;
    religion: Religion;
    caste?: string;
    city: string;
    state: string;
    profession: string;
    profilePicture?: string;
    bio?: string;
    height?: number;
    education?: string;
    annualIncome?: string;
    gallery?: {
        imageUrl: string;
        caption?: string;
    }[];
}
