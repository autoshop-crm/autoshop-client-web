import { useCallback, useEffect, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import { mapBookingBootstrapToClientViewModel, mapBookingSlotsToClientViewModel } from '../domain/client/mappers';
import { ClientBookingPageViewModel, ClientBookingSlotViewModel } from '../domain/client/view-models';
import { BookingDayAvailability } from '../types/domain';

interface UseBookingDataResult {
  loading: boolean;
  error: string | null;
  data: ClientBookingPageViewModel | null;
  availabilityLoading: boolean;
  availabilityError: string | null;
  slotsLoading: boolean;
  slotsError: string | null;
  lookupAvailability: (vehicleId: number, serviceIds: number[]) => Promise<BookingDayAvailability[]>;
  lookupSlots: (vehicleId: number, serviceIds: number[], date: string) => Promise<ClientBookingSlotViewModel[]>;
  reload: () => Promise<void>;
}

export const useBookingData = (): UseBookingDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientBookingPageViewModel | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await bookingApi.bootstrap();
      setData(mapBookingBootstrapToClientViewModel({ ...payload, slots: [] }));
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось открыть запись. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  const lookupAvailability = useCallback(async (vehicleId: number, serviceIds: number[]) => {
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    try {
      return await bookingApi.lookupAvailability({ vehicleId, serviceIds, days: 30 });
    } catch (requestError: any) {
      const message = requestError?.response?.data?.message ?? 'Не удалось загрузить календарь доступности. Попробуйте ещё раз.';
      setAvailabilityError(message);
      throw requestError;
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  const lookupSlots = useCallback(async (vehicleId: number, serviceIds: number[], date: string) => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const slots = await bookingApi.lookupSlots({ vehicleId, serviceIds, date });
      return mapBookingSlotsToClientViewModel(slots.filter((slot) => slot.available));
    } catch (requestError: any) {
      const message = requestError?.response?.data?.message ?? 'Не удалось подобрать слоты. Попробуйте ещё раз.';
      setSlotsError(message);
      throw requestError;
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, availabilityLoading, availabilityError, slotsLoading, slotsError, lookupAvailability, lookupSlots, reload };
};
