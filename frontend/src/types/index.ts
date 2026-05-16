// User & Auth Types
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  profile?: Profile;
  subscription?: Subscription;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  age?: number;
  religion: Religion;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  gothra?: string;
  country: string;
  state: string;
  city: string;
  pincode?: string;
  education: string;
  educationDetail?: string;
  profession: string;
  employer?: string;
  annualIncome?: string;
  workingCity?: string;
  height?: number;
  weight?: number;
  complexion?: string;
  bodyType?: string;
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: number;
  familyType?: string;
  familyStatus?: string;
  familyValues?: string;
  maritalStatus: MaritalStatus;
  diet?: string;
  smoking?: string;
  drinking?: string;
  bio?: string;
  hobbies: string[];
  phone: string;
  alternatePhone?: string;
  profilePicture?: string;
  gallery?: ProfileImage[];
  partnerPreferences?: PartnerPreference;
  isComplete: boolean;
  isVerified: boolean;
  createdAt: string;
  _requiresSubscription?: boolean;
}

export interface ProfileImage {
  id: string;
  imageUrl: string;
  caption?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface PartnerPreference {
  id: string;
  profileId: string;
  minAge: number;
  maxAge: number;
  minHeight?: number;
  maxHeight?: number;
  religions: Religion[];
  castes: string[];
  countries: string[];
  states: string[];
  cities: string[];
  minEducation?: string;
  professions: string[];
  maritalStatuses: MaritalStatus[];
  diets: string[];
  aboutPartner?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'FREE' | 'PAID' | 'EXPIRED';
  planName: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  paymentId?: string;
  interestsSent: number;
  profilesViewed: number;
  isExpired?: boolean;
  daysRemaining?: number;
}

export interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  meetingScheduled: boolean;
  meetingDate?: string;
  meetingVenue?: string;
  createdAt: string;
  respondedAt?: string;
  sender?: User;
  receiver?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Enums
export type Religion = 
  | 'HINDU' 
  | 'MUSLIM' 
  | 'CHRISTIAN' 
  | 'SIKH' 
  | 'BUDDHIST' 
  | 'JAIN' 
  | 'PARSI' 
  | 'JEWISH' 
  | 'OTHER';

export type MaritalStatus = 
  | 'NEVER_MARRIED' 
  | 'DIVORCED' 
  | 'WIDOWED' 
  | 'AWAITING_DIVORCE';

export type NotificationType = 
  | 'INTEREST_RECEIVED' 
  | 'INTEREST_ACCEPTED' 
  | 'INTEREST_REJECTED' 
  | 'PROFILE_VIEW' 
  | 'ADMIN_MESSAGE' 
  | 'MEETING_SCHEDULED';

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore?: boolean;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  religion: Religion;
  phone: string;
  state: string;
  city: string;
  education: string;
  profession: string;
  caste?: string;
}

export interface SearchFilters {
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

// Admin Types
export interface DashboardMetrics {
  totalUsers: number;
  maleProfiles: number;
  femaleProfiles: number;
  totalInterests: number;
  pendingInterests: number;
  acceptedInterests: number;
  paidSubscriptions: number;
  freeUsers: number;
}

export interface AdminSearchFilters extends SearchFilters {
  gender?: 'MALE' | 'FEMALE';
  subscriptionStatus?: 'FREE' | 'PAID' | 'EXPIRED';
  search?: string;
}

export interface ScheduleMeetingData {
  interestId: string;
  meetingDate: string;
  meetingVenue: string;
  meetingNotes?: string;
}

// Form Types
export interface ProfileFormData {
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

// Constants
export const RELIGIONS: { value: Religion; label: string }[] = [
  { value: 'HINDU', label: 'Hindu' },
  { value: 'MUSLIM', label: 'Muslim' },
  { value: 'CHRISTIAN', label: 'Christian' },
  { value: 'SIKH', label: 'Sikh' },
  { value: 'BUDDHIST', label: 'Buddhist' },
  { value: 'JAIN', label: 'Jain' },
  { value: 'PARSI', label: 'Parsi' },
  { value: 'JEWISH', label: 'Jewish' },
  { value: 'OTHER', label: 'Other' },
];

export const MARITAL_STATUSES: { value: MaritalStatus; label: string }[] = [
  { value: 'NEVER_MARRIED', label: 'Never Married' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'WIDOWED', label: 'Widowed' },
  { value: 'AWAITING_DIVORCE', label: 'Awaiting Divorce' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
];
