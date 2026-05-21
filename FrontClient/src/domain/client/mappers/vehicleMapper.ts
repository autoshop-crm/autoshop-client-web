import { Order, Vehicle } from '../../../types/domain';
import { formatDate } from '../formatters/clientFormatters';
import { ClientVehicleViewModel } from '../view-models';
import { isArchivedOrderStatus } from './orderMapper';

export const mapVehicleToClientViewModel = (vehicle: Vehicle, orders: Order[] = []): ClientVehicleViewModel => {
  const vehicleOrders = orders.filter((order) => order.vehicleId === vehicle.id);

  return {
    id: vehicle.id,
    title: `${vehicle.brand} ${vehicle.model}`,
    subtitle: `Госномер ${vehicle.licensePlate}`,
    licensePlate: vehicle.licensePlate,
    vin: vehicle.vin,
    createdLabel: formatDate(vehicle.createdAt),
    updatedLabel: formatDate(vehicle.updatedAt),
    activeOrdersCount: vehicleOrders.filter((order) => !isArchivedOrderStatus(order.status)).length,
    totalOrdersCount: vehicleOrders.length
  };
};
