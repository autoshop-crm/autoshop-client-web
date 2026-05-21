import { clientSelfServiceApi, mapLoyaltyOverviewToLegacy } from './clientSelfServiceApi';
import { http } from './http';
import { ApprovalRequest, Order } from '../types/domain';

interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone: 'info' | 'warning' | 'success';
  actionLabel?: string;
  actionTo?: string;
}

interface NotificationsPayload {
  notifications: NotificationRecord[];
  reminders: NotificationRecord[];
  recommendations: NotificationRecord[];
}

export const notificationsApi = {
  list: async (): Promise<NotificationsPayload> => {
    const [dashboard, orders, loyalty] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerDashboard(),
      clientSelfServiceApi.getCurrentCustomerOrders(),
      clientSelfServiceApi.getCurrentCustomerLoyalty().catch(() => null)
    ]);

    const pendingApprovals = dashboard.pendingApprovals ?? [];
    const activeOrder = (dashboard.recentOrders ?? orders).find((item) => !['HANDED_OVER', 'COMPLETED', 'CANCELLED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_INTERNAL', 'CANCELLED_NO_SHOW'].includes(item.status));
    const mappedLoyalty = loyalty ? mapLoyaltyOverviewToLegacy(loyalty).loyalty : null;

    return {
      notifications: [
        ...(pendingApprovals.length > 0
          ? [{
              id: 'notif-approval',
              title: 'Нужно решение по допработам',
              description: `Есть ${pendingApprovals.length} согласование(я), где требуется ваш ответ.`,
              createdAt: pendingApprovals[0]?.requestedAt ?? new Date().toISOString(),
              tone: 'warning' as const,
              actionLabel: 'Открыть согласования',
              actionTo: '/approvals'
            }]
          : []),
        ...(mappedLoyalty
          ? [{
              id: 'notif-loyalty',
              title: 'Бонусы доступны в кабинете',
              description: `${mappedLoyalty.pointsBalance} бонусов доступны — проверьте, как они влияют на стоимость обслуживания.`,
              createdAt: mappedLoyalty.updatedAt || new Date().toISOString(),
              tone: 'success' as const,
              actionLabel: 'Открыть лояльность',
              actionTo: '/loyalty'
            }]
          : [])
      ],
      reminders: activeOrder
        ? [{
            id: 'reminder-order',
            title: 'Ближайший визит или активный заказ',
            description: `Проверьте актуальный статус и следующий шаг по заказу #${activeOrder.id}.`,
            createdAt: activeOrder.plannedVisitAt ?? activeOrder.createdAt,
            tone: 'info',
            actionLabel: 'Открыть заказ',
            actionTo: `/orders/${activeOrder.id}`
          }]
        : [],
      recommendations: orders.length > 0
        ? [{
            id: 'rec-repeat',
            title: 'Вернуться к истории обслуживания',
            description: 'Откройте автомобили или заказы, если хотите быстро повторить визит или проверить историю.',
            createdAt: orders[0]?.updatedAt ?? new Date().toISOString(),
            tone: 'info',
            actionLabel: 'Открыть автомобили',
            actionTo: '/vehicles'
          }]
        : []
    };
  }
};
