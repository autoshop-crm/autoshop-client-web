import { ApprovalRequest, FileItem, Order, OrderTimelineEntry, Vehicle } from '../../../types/domain';
import { getClientOrderStatusMeta } from '../dictionaries/clientOrderStatusDictionary';
import { formatCountLabel, formatDateTime, formatMoney } from '../formatters/clientFormatters';
import {
  ClientApprovalStateViewModel,
  ClientDocumentsSummaryViewModel,
  ClientOrderViewModel,
  ClientTimelinePreviewItemViewModel
} from '../view-models';

const archivedStatuses = new Set(['HANDED_OVER', 'COMPLETED', 'CANCELLED', 'CANCELLED_NO_SHOW', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_INTERNAL']);

const createApprovalState = (approvals: ApprovalRequest[]): ClientApprovalStateViewModel => {
  const pendingCount = approvals.filter((approval) => approval.requestStatus === 'OPEN').length;

  if (pendingCount > 0) {
    return {
      hasPendingApprovals: true,
      pendingCount,
      primaryLabel: pendingCount === 1 ? 'Нужно 1 решение по допработам' : `Нужно ${pendingCount} решения по допработам`,
      tone: 'warning'
    };
  }

  return {
    hasPendingApprovals: false,
    pendingCount: 0,
    primaryLabel: 'Открытых согласований нет',
    tone: 'success'
  };
};

export const mapTimelineEntriesToClientPreview = (timeline: OrderTimelineEntry[]): ClientTimelinePreviewItemViewModel[] =>
  timeline
    .slice()
    .sort((left, right) => new Date(right.occurredAt ?? right.createdAt ?? 0).getTime() - new Date(left.occurredAt ?? left.createdAt ?? 0).getTime())
    .map((item) => ({
      id: item.id,
      title: item.title ?? item.summary ?? 'Обновление по заказу',
      description: item.description ?? item.summary ?? 'Появилось новое событие по заказу.',
      occurredAtLabel: formatDateTime(item.occurredAt ?? item.createdAt)
    }));

const createDocumentsSummary = (files: FileItem[]): ClientDocumentsSummaryViewModel => ({
  totalCount: files.length,
  categories: Array.from(new Set(files.map((file) => file.category))),
  primaryLabel: files.length === 0 ? 'Документы появятся здесь после обновлений по заказу' : `${formatCountLabel(files.length, 'файл', 'файлов')} доступны в заказе`
});

export const isArchivedOrderStatus = (status: string) => archivedStatuses.has(status);

export const mapOrderToClientViewModel = (params: {
  order: Order;
  vehicle?: Vehicle | null;
  approvals?: ApprovalRequest[];
  timeline?: OrderTimelineEntry[];
  files?: FileItem[];
}): ClientOrderViewModel => {
  const { order, vehicle, approvals = [], timeline = [], files = [] } = params;
  const statusMeta = getClientOrderStatusMeta(order.status);

  return {
    id: order.id,
    title: `Заказ #${order.id}`,
    statusLabel: statusMeta.label,
    statusDescription: statusMeta.description,
    nextAction: statusMeta.nextAction,
    scheduledAt: formatDateTime(order.plannedVisitAt ?? order.checkedInAt ?? order.createdAt),
    vehicleSummary: vehicle ? `${vehicle.brand} ${vehicle.model} · ${vehicle.licensePlate}` : `${order.vehicleBrand ?? 'Автомобиль'} ${order.vehicleModel ?? ''}`.trim(),
    problemSummary: order.problem,
    priceSummary: {
      laborLabel: formatMoney(order.laborTotal),
      partsLabel: formatMoney(order.partsTotal),
      totalLabel: formatMoney(order.finalAmount),
      discountLabel: order.discountAmount ? `Скидка ${formatMoney(order.discountAmount)}` : null,
      pointsLabel: order.loyaltyPointsSpent ? `${order.loyaltyPointsSpent} бонусов применено` : null,
      highlightDelta: approvals.some((approval) => approval.requestStatus === 'OPEN') ? 'Есть возможное изменение стоимости' : null
    },
    approvalState: createApprovalState(approvals),
    timelinePreview: mapTimelineEntriesToClientPreview(timeline).slice(0, 3),
    documentsSummary: createDocumentsSummary(files),
    isAttentionRequired: statusMeta.attentionRequired || approvals.some((approval) => approval.requestStatus === 'OPEN'),
    tone: statusMeta.tone,
    isArchived: isArchivedOrderStatus(order.status)
  };
};
