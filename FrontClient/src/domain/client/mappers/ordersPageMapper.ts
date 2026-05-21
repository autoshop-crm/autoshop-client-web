import { ApprovalRequest, FileItem, Order, OrderTimelineEntry, Vehicle } from '../../../types/domain';
import { ClientOrdersListViewModel } from '../view-models';
import { mapOrderToClientViewModel } from './orderMapper';

interface OrdersPageMapperInput {
  orders: Order[];
  vehicles: Vehicle[];
  approvalsByOrderId?: Record<number, ApprovalRequest[]>;
  timelineByOrderId?: Record<number, OrderTimelineEntry[]>;
  filesByOrderId?: Record<number, FileItem[]>;
}

export const mapOrdersPageToClientViewModel = ({
  orders,
  vehicles,
  approvalsByOrderId = {},
  timelineByOrderId = {},
  filesByOrderId = {}
}: OrdersPageMapperInput): ClientOrdersListViewModel => {
  const mappedOrders = orders
    .map((order) =>
      mapOrderToClientViewModel({
        order,
        vehicle: vehicles.find((vehicle) => vehicle.id === order.vehicleId) ?? null,
        approvals: approvalsByOrderId[order.id] ?? [],
        timeline: timelineByOrderId[order.id] ?? [],
        files: filesByOrderId[order.id] ?? []
      })
    )
    .sort((left, right) => right.id - left.id);

  return {
    activeOrders: mappedOrders.filter((order) => !order.isArchived),
    archivedOrders: mappedOrders.filter((order) => order.isArchived),
    actionRequiredOrders: mappedOrders.filter((order) => order.isAttentionRequired)
  };
};
