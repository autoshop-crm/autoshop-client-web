export type ClientVisualTone = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ClientPriceSummaryViewModel {
  laborLabel: string;
  partsLabel: string;
  totalLabel: string;
  discountLabel: string | null;
  pointsLabel: string | null;
  highlightDelta: string | null;
}

export interface ClientApprovalStateViewModel {
  hasPendingApprovals: boolean;
  pendingCount: number;
  primaryLabel: string;
  tone: ClientVisualTone;
}

export interface ClientDocumentsSummaryViewModel {
  totalCount: number;
  categories: string[];
  primaryLabel: string;
}

export interface ClientTimelinePreviewItemViewModel {
  id: number;
  title: string;
  description: string;
  occurredAtLabel: string;
}

export interface ClientOrderViewModel {
  id: number;
  title: string;
  statusLabel: string;
  statusDescription: string;
  nextAction: string;
  scheduledAt: string;
  vehicleSummary: string;
  problemSummary: string;
  priceSummary: ClientPriceSummaryViewModel;
  approvalState: ClientApprovalStateViewModel;
  timelinePreview: ClientTimelinePreviewItemViewModel[];
  documentsSummary: ClientDocumentsSummaryViewModel;
  isAttentionRequired: boolean;
  tone: ClientVisualTone;
  isArchived: boolean;
}

export interface ClientVehicleViewModel {
  id: number;
  title: string;
  subtitle: string;
  licensePlate: string;
  vin: string;
  createdLabel: string;
  updatedLabel: string;
  activeOrdersCount?: number;
  totalOrdersCount?: number;
}

export interface ClientDocumentItemViewModel {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  groupLabel: string;
  sizeLabel: string;
  createdAtLabel: string;
  ownerContextLabel: string;
  previewHint: string;
  isImage: boolean;
  openLabel: string;
  downloadLabel: string;
}

export interface ClientDocumentGroupViewModel {
  key: string;
  title: string;
  description: string;
  items: ClientDocumentItemViewModel[];
}

export interface ClientDocumentsHubItemViewModel {
  id: string;
  title: string;
  subtitle: string;
  ownerLabel: string;
  actionLabel: string;
  to: string;
  groups: ClientDocumentGroupViewModel[];
  totalCount: number;
}

export interface ClientUploadPolicyViewModel {
  maxFileSizeLabel: string;
  allowedFormatsLabel: string;
  helperText: string;
}

export interface ClientApprovalViewModel {
  id: number;
  orderId: number;
  title: string;
  summary: string;
  requestedAtLabel: string;
  expiresAtLabel: string | null;
  totalAmountLabel: string;
  laborAmountLabel: string;
  partsAmountLabel: string;
  decisionHint: string;
  tone: ClientVisualTone;
  isOpen: boolean;
}

export interface ClientLoyaltyViewModel {
  balanceLabel: string;
  tierLabel: string;
  earnedLabel: string;
  spentLabel: string;
  orderBenefitLabel: string;
}

export interface ClientLoyaltyLedgerItemViewModel {
  id: number;
  title: string;
  description: string;
  pointsLabel: string;
  createdAtLabel: string;
  tone: ClientVisualTone;
  orderCtaLabel: string | null;
  orderId: number | null;
}

export interface ClientLoyaltyOrderImpactViewModel {
  orderId: number;
  title: string;
  benefitLabel: string;
  totalLabel: string;
  summary: string;
  to: string;
}

export interface ClientLoyaltyPageViewModel {
  overview: ClientLoyaltyViewModel;
  explanation: string;
  currentBenefitLabel: string;
  impactCards: ClientLoyaltyOrderImpactViewModel[];
  ledger: ClientLoyaltyLedgerItemViewModel[];
}

export interface ClientDashboardViewModel {
  activeOrder: ClientOrderViewModel | null;
  pendingApprovals: ClientApprovalViewModel[];
  vehicles: ClientVehicleViewModel[];
  loyalty: ClientLoyaltyViewModel | null;
  notificationsPreview: ClientNotificationItemViewModel[];
  reminders: ClientReminderViewModel[];
  recommendations: ClientServiceRecommendationViewModel[];
  quickActions: Array<{ label: string; description: string }>;
}

export interface ClientOrdersListViewModel {
  activeOrders: ClientOrderViewModel[];
  archivedOrders: ClientOrderViewModel[];
  actionRequiredOrders: ClientOrderViewModel[];
}

export interface ClientOrderDetailsViewModel {
  order: ClientOrderViewModel;
  timeline: ClientTimelinePreviewItemViewModel[];
  approvals: ClientApprovalViewModel[];
  vehicle: ClientVehicleViewModel | null;
  loyalty: ClientLoyaltyViewModel | null;
  documents: ClientDocumentItemViewModel[];
  documentGroups: ClientDocumentGroupViewModel[];
  uploadContext: {
    ownerType: 'ORDER';
    ownerId: string;
    title: string;
  };
}

export interface ClientVehiclesListViewModel {
  vehicles: ClientVehicleViewModel[];
}

export interface ClientVehicleDetailsViewModel {
  vehicle: ClientVehicleViewModel;
  activeOrders: ClientOrderViewModel[];
  archivedOrders: ClientOrderViewModel[];
  documents: ClientDocumentItemViewModel[];
  documentGroups: ClientDocumentGroupViewModel[];
  uploadContext: {
    ownerType: 'VEHICLE';
    ownerId: string;
    title: string;
  };
}

export interface ClientDocumentsPageViewModel {
  sections: ClientDocumentsHubItemViewModel[];
  uploadPolicy: ClientUploadPolicyViewModel;
}

export interface ClientBookingVehicleOptionViewModel {
  id: number;
  title: string;
  subtitle: string;
  plateLabel: string;
}

export interface ClientBookingServiceOptionViewModel {
  id: number;
  title: string;
  subtitle: string;
  metaLabel: string;
}

export interface ClientBookingSlotViewModel {
  id: string;
  label: string;
  subtitle: string;
  badgeLabel: string | null;
}

export interface ClientBookingSummaryViewModel {
  vehicleLabel: string;
  problemLabel: string;
  slotLabel: string;
  filesLabel: string;
}

export interface ClientBookingPageViewModel {
  vehicles: ClientBookingVehicleOptionViewModel[];
  services: ClientBookingServiceOptionViewModel[];
  slots: ClientBookingSlotViewModel[];
  uploadHint: string;
  explanatoryCopy: string;
}

export interface ClientBookingSuccessViewModel {
  bookingId: string;
  orderId: number;
  title: string;
  description: string;
  slotLabel: string;
  vehicleLabel: string;
  nextStep: string;
}

export interface ClientProfileChannelViewModel {
  typeLabel: string;
  value: string;
  statusLabel: string;
  tone: ClientVisualTone;
}

export interface ClientNotificationSettingViewModel {
  key: 'orderUpdates' | 'approvals' | 'reminders' | 'promotions';
  title: string;
  description: string;
  enabled: boolean;
}

export interface ClientProfilePageViewModel {
  fullName: string;
  email: string;
  phone: string;
  profileHint: string;
  channels: ClientProfileChannelViewModel[];
  notificationSettings: ClientNotificationSettingViewModel[];
  passwordHint: string;
}

export interface ClientNotificationItemViewModel {
  id: string;
  title: string;
  description: string;
  createdAtLabel: string;
  tone: ClientVisualTone;
  actionLabel: string | null;
  actionTo: string | null;
}

export interface ClientServiceRecommendationViewModel {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

export interface ClientReminderViewModel {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

export interface ClientNotificationsPageViewModel {
  notifications: ClientNotificationItemViewModel[];
  reminders: ClientReminderViewModel[];
  recommendations: ClientServiceRecommendationViewModel[];
}
