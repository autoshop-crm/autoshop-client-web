import { clientSelfServiceApi, mapCustomerProfileToAuthUser, mapLoyaltyOverviewToLegacy } from './clientSelfServiceApi';
import { ApprovalRequest, FileItem, LoyaltyAccount, Order, OrderTimelineEntry, Vehicle } from '../types/domain';

export interface DashboardPayload {
  customer: ReturnType<typeof mapCustomerProfileToAuthUser>;
  orders: Order[];
  vehicles: Vehicle[];
  approvals: ApprovalRequest[];
  loyalty: LoyaltyAccount | null;
  timelineByOrderId: Record<number, OrderTimelineEntry[]>;
  filesByOrderId: Record<number, FileItem[]>;
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardPayload> => {
    const payload = await clientSelfServiceApi.getCurrentCustomerDashboard();
    const mappedLoyalty = mapLoyaltyOverviewToLegacy(payload.loyalty);
    return {
      customer: mapCustomerProfileToAuthUser(payload.customer),
      orders: payload.recentOrders ?? [],
      vehicles: payload.vehicles ?? [],
      approvals: payload.pendingApprovals ?? [],
      loyalty: mappedLoyalty.loyalty,
      timelineByOrderId: {},
      filesByOrderId: {}
    };
  }
};
