import { BookingConfirmation, BookingService, BookingSlot, Vehicle } from '../../../types/domain';
import {
  ClientBookingPageViewModel,
  ClientBookingServiceOptionViewModel,
  ClientBookingSlotViewModel,
  ClientBookingSuccessViewModel,
  ClientBookingVehicleOptionViewModel
} from '../view-models';
import { formatMoney } from '../formatters/clientFormatters';

const mapVehicle = (vehicle: Vehicle): ClientBookingVehicleOptionViewModel => ({
  id: vehicle.id,
  title: `${vehicle.brand} ${vehicle.model}`,
  subtitle: `VIN ${vehicle.vin}`,
  plateLabel: vehicle.licensePlate
});

const mapService = (service: BookingService): ClientBookingServiceOptionViewModel => ({
  id: service.id,
  title: service.name,
  subtitle: service.description ?? 'Услуга доступна для самостоятельной записи клиента.',
  metaLabel: [service.categoryName, service.basePrice ? formatMoney(String(service.basePrice)) : null, service.defaultDurationMinutes ? `${service.defaultDurationMinutes} мин` : null]
    .filter(Boolean)
    .join(' · ')
});

const mapSlot = (slot: BookingSlot): ClientBookingSlotViewModel => ({
  id: slot.id,
  label: slot.label,
  subtitle: slot.availableEmployeeCount > 0 ? `Доступно мастеров: ${slot.availableEmployeeCount}` : 'Свободных мастеров нет',
  badgeLabel: slot.isRecommended ? 'Рекомендуем' : null
});

export const mapBookingBootstrapToClientViewModel = (params: {
  vehicles: Vehicle[];
  services: BookingService[];
  slots?: BookingSlot[];
}): ClientBookingPageViewModel => ({
  vehicles: params.vehicles.map(mapVehicle),
  services: params.services.map(mapService),
  slots: (params.slots ?? []).map(mapSlot),
  uploadHint: 'Файлы в customer self-service пока доступны только для чтения и скачивания — загрузка будет добавлена отдельным backend пакетом.',
  explanatoryCopy: 'Запись занимает несколько коротких шагов: авто, услуги, описание проблемы, выбор времени и подтверждение. Без звонка и без staff-терминов.'
});

export const mapBookingSlotsToClientViewModel = (slots: BookingSlot[]) => slots.map(mapSlot);

export const mapBookingSuccessToClientViewModel = (booking: BookingConfirmation): ClientBookingSuccessViewModel => ({
  bookingId: booking.bookingId,
  orderId: booking.orderId ?? null,
  title: 'Запись оформлена',
  description: 'Мы сохранили ваш визит и покажем его в клиентском кабинете как ближайшую запись.',
  slotLabel: booking.slotLabel,
  vehicleLabel: booking.vehicleLabel,
  nextStep: booking.nextStep
});
