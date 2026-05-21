import { clientSelfServiceApi } from './clientSelfServiceApi';
import { http } from './http';
import { FileItem, Order, Vehicle, VehicleCatalogLinkPayload } from '../types/domain';

interface VehiclesPayload {
  vehicles: Vehicle[];
  orders: Order[];
}

interface VehicleDetailsPayload {
  vehicle: Vehicle;
  orders: Order[];
  files: FileItem[];
}

export const vehiclesApi = {
  list: async (): Promise<VehiclesPayload> => {
    const [vehicles, orders] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerVehicles(),
      clientSelfServiceApi.getCurrentCustomerOrders()
    ]);
    return { vehicles, orders };
  },
  getById: async (vehicleId: number): Promise<VehicleDetailsPayload> => {
    const [vehicle, orders, files] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerVehicle(vehicleId),
      clientSelfServiceApi.getCurrentCustomerOrders(),
      clientSelfServiceApi.getCurrentCustomerVehicleDocuments(vehicleId).catch(() => [])
    ]);

    return {
      vehicle,
      orders: orders.filter((order) => order.vehicleId === vehicle.id),
      files
    };
  },
  create: async (payload: { brand: string; model: string; vin: string; licensePlate: string }) => clientSelfServiceApi.createCurrentCustomerVehicle(payload),
  update: async (vehicleId: number, payload: { brand: string; model: string; vin: string; licensePlate: string }) =>
    clientSelfServiceApi.updateCurrentCustomerVehicle(vehicleId, payload),
  delete: async (vehicleId: number) => clientSelfServiceApi.deleteCurrentCustomerVehicle(vehicleId),
  linkCatalog: async (vehicleId: number, payload: VehicleCatalogLinkPayload) => {
    const { data } = await http.put<Vehicle>(`/api/vehicles/${vehicleId}/catalog-link`, payload);
    return data;
  }
};
