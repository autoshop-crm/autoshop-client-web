export type OrderStatus =
  | 'NEW'
  | 'WAITING_FOR_VISIT'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'DIAGNOSIS_IN_PROGRESS'
  | 'WAITING_FOR_OWNER_APPROVAL'
  | 'WAITING_FOR_PART'
  | 'REPAIR_IN_PROGRESS'
  | 'READY_FOR_OWNER'
  | 'COMPLETED'
  | 'HANDED_OVER'
  | 'CANCELLED'
  | 'CANCELLED_NO_SHOW'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_INTERNAL'
  | string;

export type ApprovalRequestStatus = 'OPEN' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' | string;
export type ApprovalType = 'EXTRA_WORK' | 'PART_ONLY' | 'MIXED_SCOPE_CHANGE' | string;
export type TimelineActorType = 'SYSTEM' | 'CUSTOMER' | 'RECEPTIONIST' | 'MECHANIC' | 'MANAGER' | 'ADMIN' | string;
export type FileOwnerType = 'CUSTOMER' | 'ORDER' | 'VEHICLE' | string;
export type FileCategory = 'CUSTOMER_DOCUMENT' | 'INSPECTION_PHOTO' | 'ESTIMATE' | 'ACT' | 'DOCUMENT' | string;
export type LoyaltyLedgerType = 'EARNED' | 'SPENT' | 'ADJUSTMENT' | string;

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
}


export interface CatalogManufacturer {
  type?: string | null;
  manufacturerId: number;
  name: string;
}

export interface CatalogModelSeries {
  type?: string | null;
  manufacturerId?: number | null;
  modelSeriesId: number;
  name: string;
  productionFrom?: string | null;
  productionTo?: string | null;
}

export interface CatalogModification {
  type: string;
  modelSeriesId: number;
  modificationId: number;
  name: string;
  powerPs?: number | null;
  capacityLiters?: number | null;
  engineType?: string | null;
  bodyType?: string | null;
  fuelType?: string | null;
  displayName?: string | null;
}

export interface VehicleCatalogLinkPayload {
  type: string;
  manufacturerId: number;
  manufacturerName: string;
  modelSeriesId: number;
  modelSeriesName: string;
  modificationId: number;
  modificationName: string;
  engineDescription?: string;
}

export interface Vehicle {
  id: number;
  customerId: number;
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  umapiType?: string | null;
  umapiManufacturerId?: string | null;
  umapiManufacturerName?: string | null;
  umapiModelSeriesId?: string | null;
  umapiModelSeriesName?: string | null;
  umapiModificationId?: string | null;
  umapiModificationName?: string | null;
  umapiEngineDescription?: string | null;
  umapiCatalogLinkedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderServiceLine {
  id: number;
  serviceId?: number | null;
  serviceName: string;
  quantity?: number | null;
  lineTotal?: string | null;
  price?: string | null;
  approvedByOwner?: boolean | null;
}

export interface Order {
  id: number;
  customerId: number;
  customerFirstName?: string | null;
  customerLastName?: string | null;
  customerEmail?: string | null;
  customerPhoneNumber?: string | null;
  vehicleId: number;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleVin?: string | null;
  vehicleLicensePlate?: string | null;
  problem: string;
  status: OrderStatus;
  plannedVisitAt?: string | null;
  plannedSlotMinutes?: number | null;
  bookingChannel?: string | null;
  intakeNotes?: string | null;
  checkedInAt?: string | null;
  readyForOwnerAt?: string | null;
  handedOverAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  laborTotal?: string | null;
  partsTotal?: string | null;
  costsTotal?: string | null;
  manualDiscountAmount?: string | null;
  discountAmount?: string | null;
  pointsDiscountAmount?: string | null;
  loyaltyPointsSpent?: number | null;
  finalAmount?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  serviceLines?: OrderServiceLine[];
}

export interface OrderTimelineEntry {
  id: number;
  orderId?: number | null;
  eventType: string;
  actorType?: TimelineActorType | null;
  effectiveStatus?: OrderStatus | null;
  summary?: string | null;
  title?: string | null;
  description?: string | null;
  actorDisplayName?: string | null;
  occurredAt?: string | null;
  createdAt?: string | null;
}

export interface ApprovalRequestedPart {
  articleNumber: string;
  brand?: string | null;
  name?: string | null;
  quantity?: number | null;
}

export interface ApprovalRequest {
  requestId: number;
  orderId: number;
  approvalType?: ApprovalType | null;
  requestStatus: ApprovalRequestStatus;
  requestToken?: string | null;
  title?: string | null;
  description?: string | null;
  laborAmount?: string | null;
  partsAmount?: string | null;
  totalAmount?: string | null;
  requestedAt: string;
  expiresAt?: string | null;
  customerContactChannel?: string | null;
  requestedPart?: ApprovalRequestedPart | null;
}

export interface LoyaltyAccount {
  id: number;
  customerId: number;
  pointsBalance: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  currentTierName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyLedgerEntry {
  id: number;
  customerId: number;
  type: LoyaltyLedgerType;
  points: number;
  title: string;
  description?: string | null;
  orderId?: number | null;
  createdAt: string;
}

export interface FileItem {
  id: string;
  category: FileCategory;
  ownerType: FileOwnerType;
  ownerId: string;
  uploadedBy?: string | null;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingService {
  id: number;
  name: string;
  description?: string | null;
  basePrice?: number | string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  defaultDurationMinutes?: number | null;
}

export interface BookingSlot {
  id: string;
  startAt: string;
  slotMinutes: number;
  available: boolean;
  availableEmployeeCount: number;
  label: string;
  isRecommended?: boolean | null;
}

export interface BookingRequest {
  vehicleId: number;
  plannedVisitAt: string;
  plannedSlotMinutes: number;
  problem: string;
  intakeNotes?: string | null;
  selectedServiceIds?: number[];
}

export interface BookingConfirmation {
  bookingId: string;
  orderId: number;
  slotLabel: string;
  vehicleLabel: string;
  nextStep: string;
}
