import { useCallback, useEffect, useState } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import { mapNotificationsToClientViewModel } from '../domain/client/mappers';
import { ClientNotificationsPageViewModel } from '../domain/client/view-models';

interface UseNotificationsDataResult {
  loading: boolean;
  error: string | null;
  data: ClientNotificationsPageViewModel | null;
  reload: () => Promise<void>;
}

export const useNotificationsData = (): UseNotificationsDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientNotificationsPageViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await notificationsApi.list();
      setData(mapNotificationsToClientViewModel(payload));
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить уведомления. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
