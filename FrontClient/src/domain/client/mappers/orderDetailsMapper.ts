import { ApprovalRequest, FileItem, LoyaltyAccount, Order, OrderTimelineEntry, Vehicle } from '../../../types/domain';
import { mapApprovalToClientViewModel } from './approvalMapper';
import { mapOrderToClientViewModel, mapTimelineEntriesToClientPreview } from './orderMapper';
import { groupClientDocuments, mapFilesToClientDocuments } from './documentMapper';
import { mapVehicleToClientViewModel } from './vehicleMapper';
import { mapLoyaltyToClientViewModel } from './loyaltyMapper';
import { ClientOrderDetailsViewModel } from '../view-models';

export const mapOrderDetailsToClientViewModel = (params: {
  order: Order;
  vehicle?: Vehicle | null;
  approvals?: ApprovalRequest[];
  timeline?: OrderTimelineEntry[];
  files?: FileItem[];
  loyalty?: LoyaltyAccount | null;
}): ClientOrderDetailsViewModel => {
  const { order, vehicle, approvals = [], timeline = [], files = [], loyalty = null } = params;
  const documents = mapFilesToClientDocuments(files, `Заказ #${order.id}`);

  return {
    order: mapOrderToClientViewModel({
      order,
      vehicle,
      approvals,
      timeline,
      files
    }),
    timeline: mapTimelineEntriesToClientPreview(timeline),
    approvals: approvals.map(mapApprovalToClientViewModel),
    vehicle: vehicle ? mapVehicleToClientViewModel(vehicle) : null,
    loyalty: loyalty ? mapLoyaltyToClientViewModel(loyalty, order.loyaltyPointsSpent) : null,
    documents,
    documentGroups: groupClientDocuments(documents),
    uploadContext: {
      ownerType: 'ORDER',
      ownerId: String(order.id),
      title: `Заказ #${order.id}`
    }
  };
};
