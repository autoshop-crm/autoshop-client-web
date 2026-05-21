export interface AuthUser {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  roles?: string[];
  expiresAt?: string;
  emailVerified?: boolean;
  profileCompleted?: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
}

export interface CustomerAuthSessionResponse {
  customerId: number;
  authUserId: number;
  email: string;
  phoneNumber?: string | null;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  requiresEmailVerification: boolean;
}

export interface LoginResponse extends CustomerAuthSessionResponse {}
export interface RegisterResponse extends CustomerAuthSessionResponse {}
export interface RefreshResponse extends CustomerAuthSessionResponse {}

export interface CustomerAuthMeResponse {
  authenticated: boolean;
  authUserId: number;
  email: string;
  roles: string[];
  emailVerified: boolean;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    email: string;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  profileCompleted: boolean;
}

export interface VerifiedChannel {
  type: 'EMAIL' | 'PHONE';
  label: string;
  verified: boolean;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  approvals: boolean;
  reminders: boolean;
  promotions: boolean;
}

export interface ProfileAccount {
  user: AuthUser;
  verifiedChannels: VerifiedChannel[];
  notificationSettings: NotificationSettings;
}
