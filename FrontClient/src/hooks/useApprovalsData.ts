import { useCallback, useEffect, useState } from 'react';
import { approvalsApi } from '../api/approvalsApi';
import { mapApprovalToClientViewModel } from '../domain/client/mappers';
import { ClientApprovalViewModel } from '../domain/client/view-models';

interface UseApprovalsDataResult {
  loading: boolean;
  error: string | null;
  openApprovals: ClientApprovalViewModel[];
  historyApprovals: ClientApprovalViewModel[];
  reload: () => Promise<void>;
}

export const useApprovalsData = (): UseApprovalsDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openApprovals, setOpenApprovals] = useState<ClientApprovalViewModel[]>([]);
  const [historyApprovals, setHistoryApprovals] = useState<ClientApprovalViewModel[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const approvals = await approvalsApi.list();
      const mapped = approvals.map(mapApprovalToClientViewModel).sort((left, right) => right.id - left.id);
      setOpenApprovals(mapped.filter((item) => item.isOpen));
      setHistoryApprovals(mapped.filter((item) => !item.isOpen));
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось загрузить согласования. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { loading, error, openApprovals, historyApprovals, reload };
};
