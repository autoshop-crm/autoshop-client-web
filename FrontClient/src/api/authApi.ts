import axios from 'axios';
import {
  AuthUser,
  CustomerAuthMeResponse,
  CustomerAuthSessionResponse,
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse
} from '../types/auth';

const authHttp = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_BASE_URL ?? ''
});

const mockUser: AuthUser = {
  id: 1,
  userId: 1,
  firstName: 'Иван',
  lastName: 'Клиент',
  email: 'client@autoshop.local',
  phone: '+7 (999) 123-45-67',
  roles: ['CUSTOMER'],
  emailVerified: true,
  profileCompleted: true
};

const authMockEnabled = import.meta.env.VITE_ENABLE_AUTH_MOCK === 'true';

const normalizeSessionUser = (session: CustomerAuthSessionResponse): AuthUser => ({
  id: session.customerId,
  userId: session.authUserId,
  firstName: 'Клиент',
  lastName: '',
  email: session.email,
  phone: session.phoneNumber ?? null,
  roles: session.roles ?? ['CUSTOMER'],
  expiresAt: session.expiresAt,
  emailVerified: session.emailVerified,
  profileCompleted: session.profileCompleted
});

const normalizeMeUser = (payload: CustomerAuthMeResponse): AuthUser => ({
  id: payload.customer?.id,
  userId: payload.authUserId,
  firstName: payload.customer?.firstName ?? 'Клиент',
  lastName: payload.customer?.lastName ?? '',
  email: payload.customer?.email ?? payload.email,
  phone: payload.customer?.phoneNumber ?? null,
  roles: payload.roles ?? ['CUSTOMER'],
  emailVerified: payload.emailVerified,
  profileCompleted: payload.profileCompleted
});

export const authApi = {
  register: async (payload: RegisterPayload) => {
    if (authMockEnabled) {
      return {
        customerId: 1,
        authUserId: 1,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        roles: ['CUSTOMER'],
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        emailVerified: false,
        profileCompleted: true,
        requiresEmailVerification: true
      } satisfies RegisterResponse;
    }

    const { data } = await authHttp.post<RegisterResponse>('/api/customer-auth/register', payload);
    return data;
  },
  login: async (payload: LoginPayload) => {
    if (authMockEnabled) {
      return {
        customerId: 1,
        authUserId: 1,
        email: payload.username || mockUser.email,
        phoneNumber: mockUser.phone,
        roles: ['CUSTOMER'],
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        emailVerified: true,
        profileCompleted: true,
        requiresEmailVerification: false
      } satisfies LoginResponse;
    }

    const { data } = await authHttp.post<LoginResponse>('/api/customer-auth/login', { email: payload.username, password: payload.password });
    return data;
  },
  refresh: async (refreshToken: string) => {
    if (authMockEnabled) {
      return {
        customerId: 1,
        authUserId: 1,
        email: mockUser.email,
        phoneNumber: mockUser.phone,
        roles: ['CUSTOMER'],
        accessToken: 'mock-access-token',
        refreshToken,
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        emailVerified: true,
        profileCompleted: true,
        requiresEmailVerification: false
      } satisfies RefreshResponse;
    }

    const { data } = await authHttp.post<RefreshResponse>('/api/customer-auth/refresh', { refreshToken });
    return data;
  },
  me: async (accessToken: string) => {
    if (authMockEnabled) {
      return mockUser;
    }

    const { data } = await authHttp.get<CustomerAuthMeResponse>('/api/customer-auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return normalizeMeUser(data);
  },
  logout: async (accessToken: string, refreshToken: string) => {
    if (authMockEnabled) {
      return;
    }

    await authHttp.post(
      '/api/customer-auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  },
  normalizeSessionUser
};
