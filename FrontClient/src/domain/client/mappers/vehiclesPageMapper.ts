import { Order, Vehicle } from '../../../types/domain';
import { mapVehicleToClientViewModel } from './vehicleMapper';
import { ClientVehiclesListViewModel } from '../view-models';

export const mapVehiclesPageToClientViewModel = (vehicles: Vehicle[], orders: Order[]): ClientVehiclesListViewModel => ({
  vehicles: vehicles.map((vehicle) => mapVehicleToClientViewModel(vehicle, orders))
});
