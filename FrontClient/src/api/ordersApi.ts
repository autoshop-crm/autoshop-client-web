import { clientSelfServiceApi, mapLoyaltyOverviewToLegacy } from './clientSelfServiceApi';
import { ApprovalRequest, FileItem, LoyaltyAccount, Order, OrderTimelineEntry, Vehicle } from '../types/domain';

interface OrdersPayload {
  orders: Order[];
  vehicles: Vehicle[];
  approvalsByOrderId: Record<number, ApprovalRequest[]>;
  timelineByOrderId: Record<number, OrderTimelineEntry[]>;
  filesByOrderId: Record<number, FileItem[]>;
}

interface OrderDetailsPayload {
  order: Order;
  vehicle: Vehicle | null;
  approvals: ApprovalRequest[];
  timeline: OrderTimelineEntry[];
  files: FileItem[];
  loyalty: LoyaltyAccount | null;
}

export const ordersApi = {
  list: async (): Promise<OrdersPayload> => {
    const [orders, vehicles] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerOrders(),
      clientSelfServiceApi.getCurrentCustomerVehicles()
    ]);

    const [approvalEntries, timelineEntries, filesEntries] = await Promise.all([
      Promise.all(orders.map(async (order) => [order.id, await clientSelfServiceApi.getOrderApprovals(order.id).catch(() => [])] as const)),
      Promise.all(orders.map(async (order) => [order.id, await clientSelfServiceApi.getCustomerTimeline(order.id).catch(() => [])] as const)),
      Promise.all(orders.map(async (order) => [order.id, await clientSelfServiceApi.getCurrentCustomerOrderDocuments(order.id).catch(() => [])] as const))
    ]);

    return {
      orders,
      vehicles,
      approvalsByOrderId: Object.fromEntries(approvalEntries) as Record<number, ApprovalRequest[]>,
      timelineByOrderId: Object.fromEntries(timelineEntries) as Record<number, OrderTimelineEntry[]>,
      filesByOrderId: Object.fromEntries(filesEntries) as Record<number, FileItem[]>
    };
  },
  getById: async (orderId: number): Promise<OrderDetailsPayload> => {
    const [order, vehicles, approvals, timeline, files, loyaltyPayload] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerOrder(orderId),
      clientSelfServiceApi.getCurrentCustomerVehicles(),
      clientSelfServiceApi.getOrderApprovals(orderId).catch(() => []),
      clientSelfServiceApi.getCustomerTimeline(orderId).catch(() => []),
      clientSelfServiceApi.getCurrentCustomerOrderDocuments(orderId).catch(() => []),
      clientSelfServiceApi.getCurrentCustomerLoyalty().catch(() => null)
    ]);

    const mappedLoyalty = loyaltyPayload ? mapLoyaltyOverviewToLegacy(loyaltyPayload).loyalty : null;

    return {
      order,
      vehicle: vehicles.find((item) => item.id === order.vehicleId) ?? null,
      approvals,
      timeline,
      files,
      loyalty: mappedLoyalty
    };
  },
  cancelBooking: async (orderId: number) => clientSelfServiceApi.cancelBooking(orderId)
};
