import { useCallback, useEffect, useState } from 'react';
import { vehiclesApi } from '../api/vehiclesApi';
import { mapVehiclesPageToClientViewModel } from '../domain/client/mappers';
import { ClientVehiclesListViewModel } from '../domain/client/view-models';

interface UseVehiclesDataResult {
  loading: boolean;
  error: string | null;
  data: ClientVehiclesListViewModel | null;
  reload: () => Promise<void>;
}

export const useVehiclesData = (): UseVehiclesDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientVehiclesListViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await vehiclesApi.list();
      setData(mapVehiclesPageToClientViewModel(payload.vehicles, payload.orders));
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить автомобили. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
