import { ProfileAccount } from '../../../types/auth';
import { ClientNotificationSettingViewModel, ClientProfilePageViewModel } from '../view-models';

const notificationMeta: Array<{
  key: 'orderUpdates' | 'approvals' | 'reminders' | 'promotions';
  title: string;
  description: string;
}> = [
  { key: 'orderUpdates', title: 'Обновления по заказам', description: 'Сообщать о смене статуса заказа и важных шагах сервиса.' },
  { key: 'approvals', title: 'Согласования', description: 'Сразу сообщать, когда нужно ваше решение по допработам.' },
  { key: 'reminders', title: 'Напоминания о визите', description: 'Напоминать о ближайшей записи и времени приезда.' },
  { key: 'promotions', title: 'Полезные предложения', description: 'Получать только редкие клиентские предложения и бонусные поводы.' }
];

export const mapProfileToClientViewModel = (profile: ProfileAccount): ClientProfilePageViewModel => ({
  fullName: `${profile.user.firstName} ${profile.user.lastName}`.trim(),
  email: profile.user.email,
  phone: profile.user.phone ?? 'Телефон не указан',
  profileHint: 'Профиль показывает только ваши данные и настройки связи с сервисом — без лишней служебной информации.',
  channels: profile.verifiedChannels.map((channel) => ({
    typeLabel: channel.type === 'EMAIL' ? 'Email' : 'Телефон',
    value: channel.label,
    statusLabel: channel.verified ? 'Подтверждён' : 'Нужно подтвердить',
    tone: channel.verified ? 'success' : 'warning'
  })),
  notificationSettings: notificationMeta.map<ClientNotificationSettingViewModel>((item) => ({
    key: item.key,
    title: item.title,
    description: item.description,
    enabled: profile.notificationSettings[item.key]
  })),
  passwordHint: 'Меняйте пароль здесь, если хотите обновить доступ без обращения в поддержку.'
});
