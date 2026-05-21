import { useCallback, useEffect, useState } from 'react';
import { documentsApi } from '../api/documentsApi';
import { mapDocumentsPageToClientViewModel } from '../domain/client/mappers';
import { ClientDocumentsPageViewModel } from '../domain/client/view-models';

interface UseDocumentsDataResult {
  loading: boolean;
  error: string | null;
  data: ClientDocumentsPageViewModel | null;
  reload: () => Promise<void>;
}

export const useDocumentsData = (): UseDocumentsDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientDocumentsPageViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [relations, payload] = await Promise.all([documentsApi.getRelations(), documentsApi.listAll()]);
      setData(
        mapDocumentsPageToClientViewModel({
          orders: relations.orders,
          vehicles: relations.vehicles,
          filesByOwner: payload.filesByOwner
        })
      );
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить документы. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
