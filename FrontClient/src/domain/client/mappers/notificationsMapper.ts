import { formatDateTime } from '../formatters/clientFormatters';
import {
  ClientNotificationItemViewModel,
  ClientNotificationsPageViewModel,
  ClientReminderViewModel,
  ClientServiceRecommendationViewModel
} from '../view-models';

interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone: 'info' | 'warning' | 'success';
  actionLabel?: string;
  actionTo?: string;
}

const mapItem = (item: NotificationRecord): ClientNotificationItemViewModel => ({
  id: item.id,
  title: item.title,
  description: item.description,
  createdAtLabel: formatDateTime(item.createdAt),
  tone: item.tone,
  actionLabel: item.actionLabel ?? null,
  actionTo: item.actionTo ?? null
});

const mapReminder = (item: NotificationRecord): ClientReminderViewModel => ({
  id: item.id,
  title: item.title,
  description: item.description,
  actionLabel: item.actionLabel ?? 'Открыть',
  actionTo: item.actionTo ?? '/'
});

const mapRecommendation = (item: NotificationRecord): ClientServiceRecommendationViewModel => ({
  id: item.id,
  title: item.title,
  description: item.description,
  actionLabel: item.actionLabel ?? 'Открыть',
  actionTo: item.actionTo ?? '/'
});

export const mapNotificationsToClientViewModel = (payload: {
  notifications: NotificationRecord[];
  reminders: NotificationRecord[];
  recommendations: NotificationRecord[];
}): ClientNotificationsPageViewModel => ({
  notifications: payload.notifications.map(mapItem),
  reminders: payload.reminders.map(mapReminder),
  recommendations: payload.recommendations.map(mapRecommendation)
});
