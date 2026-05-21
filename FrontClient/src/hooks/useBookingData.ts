import { useCallback, useEffect, useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import { mapBookingBootstrapToClientViewModel, mapBookingSlotsToClientViewModel } from '../domain/client/mappers';
import { ClientBookingPageViewModel, ClientBookingSlotViewModel } from '../domain/client/view-models';

interface UseBookingDataResult {
  loading: boolean;
  error: string | null;
  data: ClientBookingPageViewModel | null;
  slotsLoading: boolean;
  slotsError: string | null;
  lookupSlots: (vehicleId: number, serviceIds: number[]) => Promise<ClientBookingSlotViewModel[]>;
  reload: () => Promise<void>;
}

export const useBookingData = (): UseBookingDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientBookingPageViewModel | null>(null);
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

  const lookupSlots = useCallback(async (vehicleId: number, serviceIds: number[]) => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const slots = await bookingApi.lookupSlots({ vehicleId, serviceIds, days: 5 });
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

  return { loading, error, data, slotsLoading, slotsError, lookupSlots, reload };
};
