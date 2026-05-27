import { clientSelfServiceApi } from './clientSelfServiceApi';
import { BookingConfirmation, BookingDayAvailability, BookingRequest, BookingService, BookingSlot, Order, Vehicle } from '../types/domain';

interface BookingBootstrapPayload {
  vehicles: Vehicle[];
  services: BookingService[];
}

const timeRangeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC'
});

const createConfirmation = (booking: { bookingId: number; vehicleId: number; startAt: string; endAt: string }, vehicles: Vehicle[]): BookingConfirmation => {
  const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
  const vehicleLabel = vehicle ? `${vehicle.brand} ${vehicle.model} · ${vehicle.licensePlate}` : 'Автомобиль клиента';
  const slotLabel = `${timeRangeFormatter.format(new Date(booking.startAt))} – ${new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(booking.endAt))}`;
  return {
    bookingId: `Запись #${booking.bookingId}`,
    orderId: null,
    slotLabel,
    vehicleLabel,
    nextStep: 'Запись создана. Если выбранное время станет недоступно, мы предложим выбрать другой вариант.',
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
  lookupAvailability: async (params: { vehicleId: number; serviceIds: number[]; from?: string; days?: number }): Promise<BookingDayAvailability[]> =>
    clientSelfServiceApi.getBookingAvailability(params),
  lookupSlots: async (params: { vehicleId: number; serviceIds: number[]; date: string }) =>
    clientSelfServiceApi.lookupBookingSlots(params),
  create: async (payload: BookingRequest): Promise<BookingConfirmation> => {
    const [booking, vehicles] = await Promise.all([
      clientSelfServiceApi.createBooking(payload),
      clientSelfServiceApi.getCurrentCustomerVehicles()
    ]);
    return createConfirmation(booking, vehicles);
  },
  update: async (orderId: number, payload: Omit<BookingRequest, 'vehicleId'>): Promise<Order> => clientSelfServiceApi.updateBooking(orderId, payload),
  cancel: async (orderId: number): Promise<Order> => clientSelfServiceApi.cancelBooking(orderId),
  getOrder: async (orderId: number): Promise<Order> => clientSelfServiceApi.getCurrentCustomerOrder(orderId),
  getLastBooking: () => null as BookingSlot[] | null
};
