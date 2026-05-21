export const appRoutes = {
  home: '/',
  login: '/login',
  register: '/register',
  recovery: '/recovery',
  orders: '/orders',
  orderDetails: (orderId: number | string) => `/orders/${orderId}`,
  vehicles: '/vehicles',
  vehicleDetails: (vehicleId: number | string) => `/vehicles/${vehicleId}`,
  approvals: '/approvals',
  approvalDetails: (approvalId: number | string) => `/approvals/${approvalId}`,
  loyalty: '/loyalty',
  documents: '/documents',
  booking: '/booking',
  notifications: '/notifications',
  profile: '/profile'
} as const;
