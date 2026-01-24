import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  Max,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Gender, Religion, MaritalStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rahul' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsInt()
  @Min(120)
  @Max(220)
  height?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  weight?: number;

  @ApiPropertyOptional({ example: 'Fair' })
  @IsOptional()
  @IsString()
  complexion?: string;

  @ApiPropertyOptional({ example: 'Athletic' })
  @IsOptional()
  @IsString()
  bodyType?: string;

  @ApiPropertyOptional({ enum: Religion })
  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @ApiPropertyOptional({ example: 'Brahmin' })
  @IsOptional()
  @IsString()
  caste?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString()
  subCaste?: string;

  @ApiPropertyOptional({ example: 'Hindi' })
  @IsOptional()
  @IsString()
  motherTongue?: string;

  @ApiPropertyOptional({ example: 'Kashyap' })
  @IsOptional()
  @IsString()
  gothra?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Invalid pincode' })
  pincode?: string;

  @ApiPropertyOptional({ example: 'B.Tech Computer Science' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ example: 'IIT Delhi' })
  @IsOptional()
  @IsString()
  educationDetail?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ example: 'Google' })
  @IsOptional()
  @IsString()
  employer?: string;

  @ApiPropertyOptional({ example: '25-35 LPA' })
  @IsOptional()
  @IsString()
  annualIncome?: string;

  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsOptional()
  @IsString()
  workingCity?: string;

  @ApiPropertyOptional({ example: 'Suresh Sharma' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional({ example: 'Business' })
  @IsOptional()
  @IsString()
  fatherOccupation?: string;

  @ApiPropertyOptional({ example: 'Sunita Sharma' })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({ example: 'Homemaker' })
  @IsOptional()
  @IsString()
  motherOccupation?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  siblings?: number;

  @ApiPropertyOptional({ example: 'Nuclear' })
  @IsOptional()
  @IsString()
  familyType?: string;

  @ApiPropertyOptional({ example: 'Upper Middle Class' })
  @IsOptional()
  @IsString()
  familyStatus?: string;

  @ApiPropertyOptional({ example: 'Moderate' })
  @IsOptional()
  @IsString()
  familyValues?: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ example: 'Vegetarian' })
  @IsOptional()
  @IsString()
  diet?: string;

  @ApiPropertyOptional({ example: 'Never' })
  @IsOptional()
  @IsString()
  smoking?: string;

  @ApiPropertyOptional({ example: 'Never' })
  @IsOptional()
  @IsString()
  drinking?: string;

  @ApiPropertyOptional({ example: 'I am a simple person who values family...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: ['Reading', 'Traveling', 'Music'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[];

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' })
  phone?: string;

  @ApiPropertyOptional({ example: '9876543211' })
  @IsOptional()
  @IsString()
  alternatePhone?: string;
}

export class PartnerPreferenceDto {
  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(60)
  minAge?: number;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(60)
  maxAge?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsInt()
  minHeight?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsInt()
  maxHeight?: number;

  @ApiPropertyOptional({ example: ['HINDU', 'SIKH'] })
  @IsOptional()
  @IsArray()
  @IsEnum(Religion, { each: true })
  religions?: Religion[];

  @ApiPropertyOptional({ example: ['Brahmin', 'Kshatriya'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  castes?: string[];

  @ApiPropertyOptional({ example: ['India'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @ApiPropertyOptional({ example: ['Maharashtra', 'Gujarat'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  states?: string[];

  @ApiPropertyOptional({ example: ['Mumbai', 'Pune'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cities?: string[];

  @ApiPropertyOptional({ example: 'Graduate' })
  @IsOptional()
  @IsString()
  minEducation?: string;

  @ApiPropertyOptional({ example: ['Doctor', 'Engineer'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professions?: string[];

  @ApiPropertyOptional({ example: ['NEVER_MARRIED'] })
  @IsOptional()
  @IsArray()
  @IsEnum(MaritalStatus, { each: true })
  maritalStatuses?: MaritalStatus[];

  @ApiPropertyOptional({ example: ['Vegetarian'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diets?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  aboutPartner?: string;
}

export class SearchProfilesDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  minAge?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(60)
  maxAge?: number;

  @ApiPropertyOptional({ enum: Religion })
  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @ApiPropertyOptional({ example: 'Brahmin' })
  @IsOptional()
  @IsString()
  caste?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;
}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: Gender;

  @ApiProperty()
  age: number;

  @ApiProperty()
  religion: Religion;

  @ApiPropertyOptional()
  caste?: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  profession: string;

  @ApiPropertyOptional()
  profilePicture?: string;

  // Additional fields visible only with subscription
  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  education?: string;

  @ApiPropertyOptional()
  annualIncome?: string;

  @ApiPropertyOptional()
  gallery?: { imageUrl: string; caption?: string }[];
}
