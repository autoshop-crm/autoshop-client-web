import { clientSelfServiceApi } from './clientSelfServiceApi';
import { BookingConfirmation, BookingRequest, BookingService, BookingSlot, Order, Vehicle } from '../types/domain';

interface BookingBootstrapPayload {
  vehicles: Vehicle[];
  services: BookingService[];
}

const createConfirmation = (order: Order, vehicles: Vehicle[]): BookingConfirmation => {
  const vehicle = vehicles.find((item) => item.id === order.vehicleId);
  const vehicleLabel = vehicle ? `${vehicle.brand} ${vehicle.model} · ${vehicle.licensePlate}` : `${order.vehicleBrand ?? 'Автомобиль'} ${order.vehicleModel ?? ''}`.trim();
  const slotLabel = order.plannedVisitAt
    ? new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(order.plannedVisitAt))
    : 'Время будет уточнено';

  return {
    bookingId: `Заказ #${order.id}`,
    orderId: order.id,
    slotLabel,
    vehicleLabel,
    nextStep: 'Запись создана. Дальше вы сможете открыть заказ, следить за статусом, согласованиями и документами.',
  };
};

export const bookingApi = {
  bootstrap: async (): Promise<BookingBootstrapPayload> => {
    const [vehicles, services] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerVehicles(),
      clientSelfServiceApi.getBookingServices()
    ]);
    return { vehicles, services };
  },
  lookupSlots: async (params: { vehicleId: number; serviceIds: number[]; dateFrom?: string; days?: number }) =>
    clientSelfServiceApi.lookupBookingSlots(params),
  create: async (payload: BookingRequest): Promise<BookingConfirmation> => {
    const [order, vehicles] = await Promise.all([
      clientSelfServiceApi.createBooking(payload),
      clientSelfServiceApi.getCurrentCustomerVehicles()
    ]);
    return createConfirmation(order, vehicles);
  },
  update: async (orderId: number, payload: Omit<BookingRequest, 'vehicleId'>): Promise<Order> => clientSelfServiceApi.updateBooking(orderId, payload),
  cancel: async (orderId: number): Promise<Order> => clientSelfServiceApi.cancelBooking(orderId),
  getOrder: async (orderId: number): Promise<Order> => clientSelfServiceApi.getCurrentCustomerOrder(orderId),
  getLastBooking: () => null as BookingSlot[] | null
};
