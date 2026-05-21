import { useCallback, useEffect, useState } from 'react';
import { approvalsApi } from '../api/approvalsApi';
import { mapApprovalToClientViewModel } from '../domain/client/mappers';
import { ClientApprovalViewModel } from '../domain/client/view-models';

interface UseApprovalDetailsDataResult {
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  data: ClientApprovalViewModel | null;
  reload: () => Promise<void>;
  approve: (comment?: string) => Promise<void>;
  reject: (comment?: string) => Promise<void>;
}

export const useApprovalDetailsData = (approvalId?: number): UseApprovalDetailsDataResult => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [data, setData] = useState<ClientApprovalViewModel | null>(null);

  const reload = useCallback(async () => {
    if (!approvalId) {
      setError('Согласование не найдено.');
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const approval = await approvalsApi.getById(approvalId);
      setData(mapApprovalToClientViewModel(approval));
    } catch (requestError: any) {
      setError(requestError?.message === 'APPROVAL_NOT_FOUND' ? 'Согласование не найдено.' : requestError?.response?.data?.message ?? 'Не удалось загрузить согласование.');
    } finally {
      setLoading(false);
    }
  }, [approvalId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const approve = useCallback(async (comment?: string) => {
    if (!approvalId) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const approval = await approvalsApi.approve(approvalId, comment);
      setData(mapApprovalToClientViewModel(approval));
      setSuccessMessage('Дополнительные работы подтверждены. Мы передали решение в сервис.');
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось подтвердить работы.');
    } finally {
      setSaving(false);
    }
  }, [approvalId]);

  const reject = useCallback(async (comment?: string) => {
    if (!approvalId) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const approval = await approvalsApi.reject(approvalId, comment);
      setData(mapApprovalToClientViewModel(approval));
      setSuccessMessage('Согласование отклонено. Решение отправлено в сервис.');
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось отклонить работы.');
    } finally {
      setSaving(false);
    }
  }, [approvalId]);

  return { loading, saving, error, successMessage, data, reload, approve, reject };
};
