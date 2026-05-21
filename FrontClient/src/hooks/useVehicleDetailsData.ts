import { useCallback, useEffect, useState } from 'react';
import { vehiclesApi } from '../api/vehiclesApi';
import { mapVehicleDetailsToClientViewModel } from '../domain/client/mappers';
import { ClientVehicleDetailsViewModel } from '../domain/client/view-models';

interface UseVehicleDetailsDataResult {
  loading: boolean;
  error: string | null;
  data: ClientVehicleDetailsViewModel | null;
  reload: () => Promise<void>;
}

export const useVehicleDetailsData = (vehicleId?: number): UseVehicleDetailsDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientVehicleDetailsViewModel | null>(null);

  const reload = useCallback(async () => {
    if (!vehicleId) {
      setError('Автомобиль не найден.');
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = await vehiclesApi.getById(vehicleId);
      setData(mapVehicleDetailsToClientViewModel({ vehicle: payload.vehicle, orders: payload.orders, files: payload.files }));
    } catch (requestError: any) {
      setError(requestError?.message === 'VEHICLE_NOT_FOUND' ? 'Автомобиль не найден.' : requestError?.response?.data?.message ?? 'Не удалось загрузить автомобиль.');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
