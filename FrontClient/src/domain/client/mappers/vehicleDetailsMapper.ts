import { FileItem, Order, Vehicle } from '../../../types/domain';
import { mapOrderToClientViewModel } from './orderMapper';
import { groupClientDocuments, mapFilesToClientDocuments } from './documentMapper';
import { mapVehicleToClientViewModel } from './vehicleMapper';
import { ClientVehicleDetailsViewModel } from '../view-models';

export const mapVehicleDetailsToClientViewModel = (params: {
  vehicle: Vehicle;
  orders: Order[];
  files?: FileItem[];
}): ClientVehicleDetailsViewModel => {
  const { vehicle, orders, files = [] } = params;
  const mappedOrders = orders.map((order) => mapOrderToClientViewModel({ order, vehicle }));
  const documents = mapFilesToClientDocuments(files, `${vehicle.brand} ${vehicle.model}`);

  return {
    vehicle: mapVehicleToClientViewModel(vehicle, orders),
    activeOrders: mappedOrders.filter((order) => !order.isArchived),
    archivedOrders: mappedOrders.filter((order) => order.isArchived),
    documents,
    documentGroups: groupClientDocuments(documents),
    uploadContext: {
      ownerType: 'VEHICLE',
      ownerId: String(vehicle.id),
      title: `${vehicle.brand} ${vehicle.model}`
    }
  };
};
