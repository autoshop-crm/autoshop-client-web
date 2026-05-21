import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import { mapProfileToClientViewModel } from '../domain/client/mappers';
import { ClientProfilePageViewModel } from '../domain/client/view-models';

interface UseProfileDataResult {
  loading: boolean;
  error: string | null;
  data: ClientProfilePageViewModel | null;
  reload: () => Promise<void>;
}

export const useProfileData = (): UseProfileDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ClientProfilePageViewModel | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await profileApi.getProfile();
      setData(mapProfileToClientViewModel(profile));
    } catch (requestError: any) {
      setError(requestError?.message === 'PROFILE_NOT_FOUND' ? 'Профиль не найден.' : requestError?.response?.data?.message ?? 'Не удалось загрузить профиль. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, data, reload };
};
