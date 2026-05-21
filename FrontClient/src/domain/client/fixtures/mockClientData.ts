import { ApprovalRequest, FileItem, LoyaltyAccount, LoyaltyLedgerEntry, Order, OrderTimelineEntry, Vehicle } from '../../../types/domain';

export const mockVehicles: Vehicle[] = [
  {
    id: 101,
    customerId: 1,
    brand: 'Toyota',
    model: 'Camry',
    vin: 'JTNB11HK203123456',
    licensePlate: 'A777AA 77',
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-05-13T12:30:00Z'
  },
  {
    id: 102,
    customerId: 1,
    brand: 'BMW',
    model: 'X3',
    vin: 'WBAWY51050L765432',
    licensePlate: 'M555MM 77',
    createdAt: '2026-03-02T11:20:00Z',
    updatedAt: '2026-05-01T08:20:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 5401,
    customerId: 1,
    vehicleId: 101,
    vehicleBrand: 'Toyota',
    vehicleModel: 'Camry',
    vehicleLicensePlate: 'A777AA 77',
    problem: 'Посторонний шум в подвеске и проверка перед дальней поездкой',
    status: 'WAITING_FOR_OWNER_APPROVAL',
    plannedVisitAt: '2026-05-15T10:30:00Z',
    laborTotal: '14500',
    partsTotal: '11800',
    discountAmount: '1500',
    pointsDiscountAmount: '700',
    loyaltyPointsSpent: 700,
    finalAmount: '24800',
    createdAt: '2026-05-14T08:00:00Z',
    updatedAt: '2026-05-14T12:00:00Z'
  },
  {
    id: 5300,
    customerId: 1,
    vehicleId: 102,
    vehicleBrand: 'BMW',
    vehicleModel: 'X3',
    vehicleLicensePlate: 'M555MM 77',
    problem: 'Плановое ТО',
    status: 'HANDED_OVER',
    plannedVisitAt: '2026-04-20T08:00:00Z',
    laborTotal: '8000',
    partsTotal: '12000',
    finalAmount: '20000',
    createdAt: '2026-04-18T10:00:00Z',
    updatedAt: '2026-04-20T18:10:00Z',
    completedAt: '2026-04-20T18:10:00Z',
    handedOverAt: '2026-04-20T18:10:00Z'
  }
];

export const mockApprovals: ApprovalRequest[] = [
  {
    requestId: 9001,
    orderId: 5401,
    approvalType: 'EXTRA_WORK',
    requestStatus: 'OPEN',
    title: 'Замена передних стоек стабилизатора',
    description: 'Во время диагностики нашли износ, который влияет на шум и управляемость.',
    laborAmount: '4500',
    partsAmount: '6300',
    totalAmount: '10800',
    requestedAt: '2026-05-14T11:40:00Z',
    expiresAt: '2026-05-15T11:40:00Z',
    customerContactChannel: 'APP'
  }
];

export const mockTimelineByOrderId: Record<number, OrderTimelineEntry[]> = {
  5401: [
    {
      id: 1,
      orderId: 5401,
      eventType: 'APPROVAL_REQUESTED',
      title: 'Нужно ваше подтверждение',
      description: 'Мы добавили согласование по дополнительным работам.',
      occurredAt: '2026-05-14T11:40:00Z'
    },
    {
      id: 2,
      orderId: 5401,
      eventType: 'DIAGNOSIS_STARTED',
      title: 'Начали диагностику',
      description: 'Автомобиль уже в работе, идёт проверка состояния.',
      occurredAt: '2026-05-14T09:50:00Z'
    },
    {
      id: 3,
      orderId: 5401,
      eventType: 'CHECKED_IN',
      title: 'Автомобиль принят',
      description: 'Машина принята в сервис в назначенное время.',
      occurredAt: '2026-05-14T08:10:00Z'
    }
  ]
};

export const mockFilesByOrderId: Record<number, FileItem[]> = {
  5401: [
    {
      id: 'file-1',
      category: 'INSPECTION_PHOTO',
      ownerType: 'ORDER',
      ownerId: '5401',
      originalFilename: 'suspension-photo-1.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 860000,
      status: 'READY',
      createdAt: '2026-05-14T11:25:00Z',
      updatedAt: '2026-05-14T11:25:00Z'
    },
    {
      id: 'file-2',
      category: 'ESTIMATE',
      ownerType: 'ORDER',
      ownerId: '5401',
      originalFilename: 'estimate.pdf',
      contentType: 'application/pdf',
      sizeBytes: 120000,
      status: 'READY',
      createdAt: '2026-05-14T11:30:00Z',
      updatedAt: '2026-05-14T11:30:00Z'
    }
  ]
};

export const mockLoyaltyAccount: LoyaltyAccount = {
  id: 300,
  customerId: 1,
  pointsBalance: 2480,
  totalPointsEarned: 5200,
  totalPointsSpent: 2720,
  currentTierName: 'Silver',
  createdAt: '2026-02-01T12:00:00Z',
  updatedAt: '2026-05-14T12:00:00Z'
};


export const mockLoyaltyLedger: LoyaltyLedgerEntry[] = [
  {
    id: 1,
    customerId: 1,
    type: 'SPENT',
    points: -700,
    title: 'Скидка по заказу #5401',
    description: 'Бонусы уменьшили стоимость текущего обслуживания.',
    orderId: 5401,
    createdAt: '2026-05-14T12:00:00Z'
  },
  {
    id: 2,
    customerId: 1,
    type: 'EARNED',
    points: 420,
    title: 'Начисление за заказ #5300',
    description: 'Бонусы начислены после завершённого ТО.',
    orderId: 5300,
    createdAt: '2026-04-20T18:15:00Z'
  },
  {
    id: 3,
    customerId: 1,
    type: 'EARNED',
    points: 180,
    title: 'Бонус за повторный визит',
    description: 'Дополнительная выгода за регулярное обслуживание.',
    orderId: null,
    createdAt: '2026-03-30T10:00:00Z'
  }
];
