import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateAge(dateOfBirth: string | Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function formatHeight(cm: number): string {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}" (${cm} cm)`;
}

export function formatIncome(income: string): string {
  return income ? `₹${income}` : 'Not specified';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
}

export function getReligionLabel(religion: string): string {
  const labels: Record<string, string> = {
    HINDU: 'Hindu',
    MUSLIM: 'Muslim',
    CHRISTIAN: 'Christian',
    SIKH: 'Sikh',
    BUDDHIST: 'Buddhist',
    JAIN: 'Jain',
    PARSI: 'Parsi',
    JEWISH: 'Jewish',
    OTHER: 'Other',
  };
  return labels[religion] || religion;
}

export function getMaritalStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NEVER_MARRIED: 'Never Married',
    DIVORCED: 'Divorced',
    WIDOWED: 'Widowed',
    AWAITING_DIVORCE: 'Awaiting Divorce',
  };
  return labels[status] || status;
}

export function getSubscriptionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    FREE: 'bg-gray-100 text-gray-800',
    PAID: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getInterestStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getProfileCompletionPercentage(profile: any): number {
  const fields = [
    'firstName', 'lastName', 'gender', 'dateOfBirth', 'religion',
    'caste', 'state', 'city', 'education', 'profession',
    'height', 'bio', 'phone', 'profilePicture', 'hobbies',
  ];

  const filledFields = fields.filter((field) => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  return Math.round((filledFields.length / fields.length) * 100);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password) && !/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number or special character' };
  }
  return { valid: true };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
