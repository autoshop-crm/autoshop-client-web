import { authStorage } from '../auth/storage';
import { clientSelfServiceApi, mapCustomerProfileToAuthUser } from './clientSelfServiceApi';
import { NotificationSettings, ProfileAccount, VerifiedChannel } from '../types/auth';

const notificationSettings: NotificationSettings = {
  orderUpdates: false,
  approvals: false,
  reminders: false,
  promotions: false
};

export const profileApi = {
  getProfile: async (): Promise<ProfileAccount> => {
    const profile = await clientSelfServiceApi.getCurrentCustomer();
    const user = mapCustomerProfileToAuthUser(profile);
    authStorage.setUser(user);

    const verifiedChannels: VerifiedChannel[] = [
      { type: 'EMAIL', label: profile.email, verified: Boolean(profile.emailVerified) },
      { type: 'PHONE', label: profile.phoneNumber ?? 'Телефон не указан', verified: Boolean(profile.phoneNumber) }
    ];

    return {
      user,
      verifiedChannels,
      notificationSettings
    };
  },
  updateContacts: async (payload: { firstName: string; lastName: string; email: string; phone: string }) => {
    const updatedProfile = await clientSelfServiceApi.updateCurrentCustomer({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phone
    });
    const user = mapCustomerProfileToAuthUser(updatedProfile);
    authStorage.setUser(user);
    return user;
  },
  updatePassword: async (_payload: { currentPassword: string; nextPassword: string }) => {
    throw new Error('PASSWORD_API_NOT_CONNECTED');
  },
  updateNotifications: async (_payload: NotificationSettings) => {
    throw new Error('NOTIFICATIONS_SETTINGS_API_NOT_CONNECTED');
  }
};
