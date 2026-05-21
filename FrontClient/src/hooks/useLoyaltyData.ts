import { useCallback, useEffect, useState } from 'react';
import { loyaltyApi } from '../api/loyaltyApi';
import { mapLoyaltyPageToClientViewModel } from '../domain/client/mappers';
import { ClientLoyaltyPageViewModel } from '../domain/client/view-models';

interface UseLoyaltyDataResult {
  loading: boolean;
  error: string | null;
  data: ClientLoyaltyPageViewModel | null;
  reload: () => Promise<void>;
}

export const useLoyaltyData = (): UseLoyaltyDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientLoyaltyPageViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await loyaltyApi.getOverview();
      if (!payload.loyalty) {
        setData(null);
        setError('Программа лояльности пока недоступна.');
        return;
      }

      setData(
        mapLoyaltyPageToClientViewModel({
          loyalty: payload.loyalty,
          ledger: payload.ledger,
          orders: payload.orders
        })
      );
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить лояльность. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
