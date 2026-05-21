import { ApprovalRequest } from '../../../types/domain';
import { getClientApprovalStatusMeta } from '../dictionaries/clientApprovalStatusDictionary';
import { formatDateTime, formatMoney } from '../formatters/clientFormatters';
import { ClientApprovalViewModel } from '../view-models';

export const mapApprovalToClientViewModel = (approval: ApprovalRequest): ClientApprovalViewModel => {
  const statusMeta = getClientApprovalStatusMeta(approval.requestStatus);

  return {
    id: approval.requestId,
    orderId: approval.orderId,
    title: approval.title ?? 'Дополнительные работы',
    summary: approval.description ?? statusMeta.hint,
    requestedAtLabel: formatDateTime(approval.requestedAt),
    expiresAtLabel: approval.expiresAt ? formatDateTime(approval.expiresAt) : null,
    totalAmountLabel: formatMoney(approval.totalAmount),
    laborAmountLabel: formatMoney(approval.laborAmount, 'Не указано'),
    partsAmountLabel: formatMoney(approval.partsAmount, 'Не указано'),
    decisionHint: statusMeta.hint,
    tone: statusMeta.tone,
    isOpen: statusMeta.isOpen
  };
};
