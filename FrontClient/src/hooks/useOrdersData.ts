import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api/ordersApi';
import { mapOrdersPageToClientViewModel } from '../domain/client/mappers';
import { ClientOrdersListViewModel } from '../domain/client/view-models';

interface UseOrdersDataResult {
  loading: boolean;
  error: string | null;
  data: ClientOrdersListViewModel | null;
  reload: () => Promise<void>;
}

export const useOrdersData = (): UseOrdersDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientOrdersListViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await ordersApi.list();
      setData(
        mapOrdersPageToClientViewModel({
          orders: payload.orders,
          vehicles: payload.vehicles,
          approvalsByOrderId: payload.approvalsByOrderId,
          timelineByOrderId: payload.timelineByOrderId,
          filesByOrderId: payload.filesByOrderId
        })
      );
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить список заказов. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
