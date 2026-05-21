import { ApprovalRequestStatus } from '../../../types/domain';
import { ClientVisualTone } from '../view-models';

interface ClientApprovalStatusDictionaryItem {
  label: string;
  hint: string;
  tone: ClientVisualTone;
  isOpen: boolean;
}

const defaultStatus: ClientApprovalStatusDictionaryItem = {
  label: 'Статус обновляется',
  hint: 'Откройте запрос позже, чтобы увидеть актуальные детали.',
  tone: 'neutral',
  isOpen: false
};

const approvalStatusDictionary: Partial<Record<ApprovalRequestStatus, ClientApprovalStatusDictionaryItem>> = {
  OPEN: {
    label: 'Ждёт вашего решения',
    hint: 'Подтвердите или отклоните дополнительные работы.',
    tone: 'warning',
    isOpen: true
  },
  APPROVED: {
    label: 'Подтверждено',
    hint: 'Работы можно продолжать по согласованному объёму.',
    tone: 'success',
    isOpen: false
  },
  REJECTED: {
    label: 'Отклонено',
    hint: 'Дополнительные работы не были согласованы.',
    tone: 'error',
    isOpen: false
  },
  CANCELLED: {
    label: 'Отменено',
    hint: 'Запрос отменён и больше не требует действий.',
    tone: 'neutral',
    isOpen: false
  },
  EXPIRED: {
    label: 'Срок истёк',
    hint: 'Запрос больше недоступен для решения.',
    tone: 'error',
    isOpen: false
  }
};

export const getClientApprovalStatusMeta = (status: ApprovalRequestStatus): ClientApprovalStatusDictionaryItem => approvalStatusDictionary[status] ?? defaultStatus;
