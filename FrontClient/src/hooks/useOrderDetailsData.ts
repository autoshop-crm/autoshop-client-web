import { useCallback, useEffect, useState } from 'react';
import { ordersApi } from '../api/ordersApi';
import { mapOrderDetailsToClientViewModel } from '../domain/client/mappers';
import { ClientOrderDetailsViewModel } from '../domain/client/view-models';

interface UseOrderDetailsDataResult {
  loading: boolean;
  error: string | null;
  data: ClientOrderDetailsViewModel | null;
  reload: () => Promise<void>;
}

export const useOrderDetailsData = (orderId?: number): UseOrderDetailsDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientOrderDetailsViewModel | null>(null);

  const reload = useCallback(async () => {
    if (!orderId) {
      setData(null);
      setError('Заказ не найден.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = await ordersApi.getById(orderId);
      setData(
        mapOrderDetailsToClientViewModel({
          order: payload.order,
          vehicle: payload.vehicle,
          approvals: payload.approvals,
          timeline: payload.timeline,
          files: payload.files,
          loyalty: payload.loyalty
        })
      );
    } catch (requestError: any) {
      setError(requestError?.message === 'ORDER_NOT_FOUND' ? 'Заказ не найден.' : requestError?.response?.data?.message ?? 'Не удалось загрузить заказ. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
