import { ApprovalRequest, FileItem, LoyaltyAccount, Order, OrderTimelineEntry, Vehicle } from '../../../types/domain';
import { mapApprovalToClientViewModel } from './approvalMapper';
import { mapLoyaltyToClientViewModel } from './loyaltyMapper';
import { mapOrderToClientViewModel } from './orderMapper';
import { mapVehicleToClientViewModel } from './vehicleMapper';
import { ClientDashboardViewModel } from '../view-models';

interface DashboardMapperInput {
  orders: Order[];
  vehicles: Vehicle[];
  approvals: ApprovalRequest[];
  loyalty?: LoyaltyAccount | null;
  timelineByOrderId?: Record<number, OrderTimelineEntry[]>;
  filesByOrderId?: Record<number, FileItem[]>;
}

export const mapDashboardToClientViewModel = ({
  orders,
  vehicles,
  approvals,
  loyalty,
  timelineByOrderId = {},
  filesByOrderId = {}
}: DashboardMapperInput): ClientDashboardViewModel => {
  const activeOrder = orders
    .filter((order) => !['HANDED_OVER', 'COMPLETED', 'CANCELLED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_INTERNAL', 'CANCELLED_NO_SHOW'].includes(order.status))
    .sort((left, right) => new Date(left.plannedVisitAt ?? left.createdAt).getTime() - new Date(right.plannedVisitAt ?? right.createdAt).getTime())[0] ?? null;

  const orderApprovals = activeOrder ? approvals.filter((approval) => approval.orderId === activeOrder.id) : [];
  const selectedVehicle = activeOrder ? vehicles.find((vehicle) => vehicle.id === activeOrder.vehicleId) ?? null : null;

  return {
    activeOrder: activeOrder
      ? mapOrderToClientViewModel({
          order: activeOrder,
          vehicle: selectedVehicle,
          approvals: orderApprovals,
          timeline: timelineByOrderId[activeOrder.id] ?? [],
          files: filesByOrderId[activeOrder.id] ?? []
        })
      : null,
    pendingApprovals: approvals.filter((approval) => approval.requestStatus === 'OPEN').map(mapApprovalToClientViewModel),
    vehicles: vehicles.map((vehicle) => mapVehicleToClientViewModel(vehicle, orders)),
    loyalty: loyalty ? mapLoyaltyToClientViewModel(loyalty, activeOrder?.loyaltyPointsSpent) : null,
    notificationsPreview: [
      {
        id: 'dash-approval',
        title: 'Есть событие, требующее внимания',
        description: approvals.some((approval) => approval.requestStatus === 'OPEN') ? 'По одному из заказов нужно ваше решение по допработам.' : 'Новых срочных событий пока нет.',
        createdAtLabel: 'Сейчас',
        tone: approvals.some((approval) => approval.requestStatus === 'OPEN') ? 'warning' : 'info',
        actionLabel: approvals.some((approval) => approval.requestStatus === 'OPEN') ? 'Открыть согласования' : 'Открыть центр событий',
        actionTo: approvals.some((approval) => approval.requestStatus === 'OPEN') ? '/approvals' : '/notifications'
      }
    ],
    reminders: activeOrder
      ? [
          {
            id: 'dash-reminder',
            title: 'Ближайшая запись или активный визит',
            description: activeOrder.plannedVisitAt ?? activeOrder.createdAt,
            actionLabel: 'Проверить заказ',
            actionTo: `/orders/${activeOrder.id}`
          }
        ]
      : [
          {
            id: 'dash-reminder-empty',
            title: 'Новая запись без звонка',
            description: 'Если нужно обслуживание, оформите запись в пару шагов прямо из кабинета.',
            actionLabel: 'Записаться в сервис',
            actionTo: '/booking'
          }
        ],
    recommendations: [
      {
        id: 'dash-repeat-visit',
        title: 'Вернуться к сервису без лишних шагов',
        description: 'Откройте автомобили, историю заказов или сразу оформите новый визит — в зависимости от текущей задачи.',
        actionLabel: 'Открыть автомобили',
        actionTo: '/vehicles'
      }
    ],
    quickActions: [
      { label: 'Открыть активный заказ', description: 'Сразу перейти к текущему status-first экрану.' },
      { label: 'Проверить согласования', description: 'Быстро посмотреть запросы, где нужно решение.' },
      { label: 'Открыть мои автомобили', description: 'Посмотреть машины и их историю обслуживания.' },
      { label: 'Открыть центр событий', description: 'Посмотреть напоминания и полезные сервисные поводы.' }
    ]
  };
};
