import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { mapDashboardToClientViewModel } from '../domain/client/mappers';
import { ClientDashboardViewModel } from '../domain/client/view-models';

interface UseDashboardDataResult {
  loading: boolean;
  error: string | null;
  data: ClientDashboardViewModel | null;
  reload: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientDashboardViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await dashboardApi.getOverview();
      setData(
        mapDashboardToClientViewModel({
          orders: payload.orders,
          vehicles: payload.vehicles,
          approvals: payload.approvals,
          loyalty: payload.loyalty,
          timelineByOrderId: payload.timelineByOrderId,
          filesByOrderId: payload.filesByOrderId
        })
      );
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить dashboard. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    loading,
    error,
    data,
    reload
  };
};
