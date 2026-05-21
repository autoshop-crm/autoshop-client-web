import { clientSelfServiceApi } from './clientSelfServiceApi';
import { ApprovalRequest } from '../types/domain';

const generateDecisionToken = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const approvalsApi = {
  list: async (): Promise<ApprovalRequest[]> => {
    const orders = await clientSelfServiceApi.getCurrentCustomerOrders();
    const result = await Promise.all(orders.map((order) => clientSelfServiceApi.getOrderApprovals(order.id).catch(() => [])));
    return result.flat().sort((a, b) => (b.requestId ?? 0) - (a.requestId ?? 0));
  },
  getById: async (approvalId: number): Promise<ApprovalRequest> => {
    const approvals = await approvalsApi.list();
    const approval = approvals.find((item) => item.requestId === approvalId);
    if (!approval) {
      throw new Error('APPROVAL_NOT_FOUND');
    }
    return approval;
  },
  approve: async (approvalId: number, comment?: string): Promise<ApprovalRequest> => {
    const approval = await approvalsApi.getById(approvalId);
    return clientSelfServiceApi.approveOrderApproval(approval.orderId, approval.requestId, {
      decisionToken: generateDecisionToken(),
      comment
    });
  },
  reject: async (approvalId: number, comment?: string): Promise<ApprovalRequest> => {
    const approval = await approvalsApi.getById(approvalId);
    return clientSelfServiceApi.rejectOrderApproval(approval.orderId, approval.requestId, {
      decisionToken: generateDecisionToken(),
      comment
    });
  }
};
