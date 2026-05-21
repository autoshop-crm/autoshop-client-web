import { http } from './http';
import { ApprovalRequest, BookingRequest, BookingService, BookingSlot, FileItem, Order, OrderTimelineEntry, Vehicle } from '../types/domain';
import { AuthUser } from '../types/auth';

interface CustomerProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  email: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardResponse {
  customer: CustomerProfileResponse;
  recentOrders: Order[];
  pendingApprovals: ApprovalRequest[];
  vehicles: Vehicle[];
  loyalty: LoyaltyOverviewResponse;
  loyaltySettings?: {
    enabled?: boolean;
    earnEnabled?: boolean;
    spendEnabled?: boolean;
    visible?: boolean;
  } | null;
}

interface LoyaltyOverviewResponse {
  account: {
    id: number;
    customerId: number;
    balance: number;
    totalSpent?: number | null;
    totalEarnedPoints: number;
    tier?: { id: number; name: string } | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  recentTransactions: Array<{
    id: number;
    accountId: number;
    orderId?: number | null;
    operationType: string;
    reason?: string | null;
    pointsAmount: number;
    createdAt: string;
  }>;
  tiers?: Array<{ id: number; name: string }>;
}

interface CustomerFileMetadataResponse {
  fileId: string;
  filename: string;
  category: string;
  ownerType: string;
  ownerId: string;
  contentType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
}

interface CustomerFileDownloadUrlResponse {
  url: string;
}

interface CustomerBookingSlotResponse {
  startAt: string;
  slotMinutes: number;
  available: boolean;
  availableEmployeeCount: number;
}

export const mapCustomerProfileToAuthUser = (profile: CustomerProfileResponse): AuthUser => ({
  id: profile.id,
  userId: profile.id,
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  phone: profile.phoneNumber ?? null,
  emailVerified: profile.emailVerified,
  profileCompleted: true,
  roles: ['CUSTOMER']
});

export const mapLoyaltyOverviewToLegacy = (payload: LoyaltyOverviewResponse): { loyalty: import('../types/domain').LoyaltyAccount | null; ledger: import('../types/domain').LoyaltyLedgerEntry[] } => ({
  loyalty: payload.account
    ? {
        id: payload.account.id,
        customerId: payload.account.customerId,
        pointsBalance: payload.account.balance,
        totalPointsEarned: payload.account.totalEarnedPoints,
        totalPointsSpent: Math.max(0, ...payload.recentTransactions.filter((item) => item.pointsAmount < 0).map((item) => Math.abs(item.pointsAmount)), 0),
        currentTierName: payload.account.tier?.name ?? 'Базовый уровень',
        createdAt: payload.account.createdAt,
        updatedAt: payload.account.updatedAt
      }
    : null,
  ledger: payload.recentTransactions.map((item) => ({
    id: item.id,
    customerId: payload.account?.customerId ?? 0,
    type: item.operationType,
    points: item.pointsAmount,
    title: item.reason ?? (item.pointsAmount >= 0 ? 'Начисление бонусов' : 'Списание бонусов'),
    description: item.orderId ? `Связано с заказом #${item.orderId}` : 'Изменение бонусного баланса.',
    orderId: item.orderId ?? null,
    createdAt: item.createdAt
  }))
});

const mapFileMetadata = (file: CustomerFileMetadataResponse): FileItem => ({
  id: file.fileId,
  category: file.category,
  ownerType: file.ownerType,
  ownerId: file.ownerId,
  originalFilename: file.filename,
  contentType: file.contentType,
  sizeBytes: file.sizeBytes,
  status: file.status,
  createdAt: file.createdAt,
  updatedAt: file.createdAt
});

const makeSlotId = (startAt: string, slotMinutes: number) => `${startAt}|${slotMinutes}`;

const slotLabelFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
});

const mapBookingSlot = (slot: CustomerBookingSlotResponse): BookingSlot => ({
  id: makeSlotId(slot.startAt, slot.slotMinutes),
  startAt: slot.startAt,
  slotMinutes: slot.slotMinutes,
  available: slot.available,
  availableEmployeeCount: slot.availableEmployeeCount,
  label: `${slotLabelFormatter.format(new Date(slot.startAt))} · ${slot.slotMinutes} мин`,
  isRecommended: slot.available && slot.availableEmployeeCount > 1
});

export const clientSelfServiceApi = {
  getCurrentCustomer: async () => {
    const { data } = await http.get<CustomerProfileResponse>('/api/customers/me');
    return data;
  },
  updateCurrentCustomer: async (payload: { firstName: string; lastName: string; phoneNumber: string }) => {
    const { data } = await http.put<CustomerProfileResponse>('/api/customers/me', payload);
    return data;
  },
  getCurrentCustomerOrders: async () => {
    const { data } = await http.get<Order[]>('/api/customers/me/orders');
    return data;
  },
  getCurrentCustomerOrder: async (orderId: number) => {
    const { data } = await http.get<Order>(`/api/customers/me/orders/${orderId}`);
    return data;
  },
  getCurrentCustomerVehicles: async () => {
    const { data } = await http.get<Vehicle[]>('/api/customers/me/vehicles');
    return data;
  },
  getCurrentCustomerVehicle: async (vehicleId: number) => {
    const { data } = await http.get<Vehicle>(`/api/customers/me/vehicles/${vehicleId}`);
    return data;
  },
  createCurrentCustomerVehicle: async (payload: { brand: string; model: string; vin: string; licensePlate: string }) => {
    const { data } = await http.post<Vehicle>('/api/customers/me/vehicles', payload);
    return data;
  },
  updateCurrentCustomerVehicle: async (vehicleId: number, payload: { brand: string; model: string; vin: string; licensePlate: string }) => {
    const { data } = await http.put<Vehicle>(`/api/customers/me/vehicles/${vehicleId}`, payload);
    return data;
  },
  deleteCurrentCustomerVehicle: async (vehicleId: number) => {
    await http.delete(`/api/customers/me/vehicles/${vehicleId}`);
  },
  getCurrentCustomerLoyalty: async () => {
    const { data } = await http.get<LoyaltyOverviewResponse>('/api/customers/me/loyalty');
    return data;
  },
  getCurrentCustomerDashboard: async () => {
    const { data } = await http.get<DashboardResponse>('/api/customers/me/dashboard');
    return data;
  },
  getBookingServices: async () => {
    const { data } = await http.get<BookingService[]>('/api/customers/me/booking/services');
    return data;
  },
  lookupBookingSlots: async (params: { vehicleId: number; serviceIds?: number[]; dateFrom?: string; days?: number; slotMinutes?: number }) => {
    const search = new URLSearchParams();
    search.set('vehicleId', String(params.vehicleId));
    params.serviceIds?.forEach((serviceId) => search.append('serviceIds', String(serviceId)));
    if (params.dateFrom) search.set('dateFrom', params.dateFrom);
    if (typeof params.days === 'number') search.set('days', String(params.days));
    if (typeof params.slotMinutes === 'number') search.set('slotMinutes', String(params.slotMinutes));
    const { data } = await http.get<CustomerBookingSlotResponse[]>(`/api/customers/me/booking/slots?${search.toString()}`);
    return data.map(mapBookingSlot);
  },
  createBooking: async (payload: BookingRequest) => {
    const { data } = await http.post<Order>('/api/customers/me/bookings', payload);
    return data;
  },
  updateBooking: async (orderId: number, payload: Omit<BookingRequest, 'vehicleId'>) => {
    const { data } = await http.put<Order>(`/api/customers/me/bookings/${orderId}`, payload);
    return data;
  },
  cancelBooking: async (orderId: number) => {
    const { data } = await http.post<Order>(`/api/customers/me/bookings/${orderId}/cancel`, {});
    return data;
  },
  getOrderApprovals: async (orderId: number) => {
    const { data } = await http.get<ApprovalRequest[]>(`/api/customers/me/orders/${orderId}/approvals`);
    return data;
  },
  approveOrderApproval: async (orderId: number, requestId: number, payload: { decisionToken: string; comment?: string }) => {
    const { data } = await http.post<ApprovalRequest>(`/api/customers/me/orders/${orderId}/approvals/${requestId}/approve`, payload);
    return data;
  },
  rejectOrderApproval: async (orderId: number, requestId: number, payload: { decisionToken: string; comment?: string }) => {
    const { data } = await http.post<ApprovalRequest>(`/api/customers/me/orders/${orderId}/approvals/${requestId}/reject`, payload);
    return data;
  },
  getCurrentCustomerDocuments: async () => {
    const { data } = await http.get<CustomerFileMetadataResponse[]>('/api/customers/me/documents');
    return data.map(mapFileMetadata);
  },
  getCurrentCustomerVehicleDocuments: async (vehicleId: number) => {
    const { data } = await http.get<CustomerFileMetadataResponse[]>(`/api/customers/me/vehicles/${vehicleId}/documents`);
    return data.map(mapFileMetadata);
  },
  getCurrentCustomerOrderDocuments: async (orderId: number) => {
    const { data } = await http.get<CustomerFileMetadataResponse[]>(`/api/customers/me/orders/${orderId}/documents`);
    return data.map(mapFileMetadata);
  },
  getPresignedDownloadUrl: async (fileId: string) => {
    const { data } = await http.post<CustomerFileDownloadUrlResponse>(`/api/customers/me/files/${fileId}/presigned-download-url`, {});
    return data.url;
  },
  getCustomerTimeline: async (orderId: number) => {
    const { data } = await http.get<OrderTimelineEntry[]>(`/api/orders/${orderId}/timeline/customer`);
    return data;
  }
};
