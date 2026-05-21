import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLoader } from '../components/AppLoader';
import { useAuth } from './providers/AuthProvider';
import { ProtectedRoute } from './router/ProtectedRoute';
import { PublicRoute } from './router/PublicRoute';
import { appRoutes } from './router/routeMap';
import { ClientLayout } from '../layouts/client/ClientLayout';
import { ApprovalDecisionPage } from '../pages/approvals/ApprovalDecisionPage';
import { ApprovalsPage } from '../pages/approvals/ApprovalsPage';
import { BookingPage } from '../pages/booking/BookingPage';
import { RecoveryPlaceholderPage } from '../pages/auth/RecoveryPlaceholderPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPlaceholderPage } from '../pages/auth/RegisterPlaceholderPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DocumentsPage } from '../pages/documents/DocumentsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { LoyaltyPage } from '../pages/loyalty/LoyaltyPage';
import { OrderDetailsPage } from '../pages/orders/OrderDetailsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { PlaceholderSectionPage } from '../pages/shared/PlaceholderSectionPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { VehicleDetailsPage } from '../pages/vehicles/VehicleDetailsPage';
import { VehiclesPage } from '../pages/vehicles/VehiclesPage';

export const App = () => {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return <AppLoader />;
  }

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={appRoutes.login} element={<LoginPage />} />
        <Route path={appRoutes.register} element={<RegisterPlaceholderPage />} />
        <Route path={appRoutes.recovery} element={<RecoveryPlaceholderPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route path={appRoutes.home} element={<DashboardPage />} />
          <Route path={appRoutes.orders} element={<OrdersPage />} />
          <Route path={appRoutes.orderDetails(':orderId')} element={<OrderDetailsPage />} />
          <Route path={appRoutes.vehicles} element={<VehiclesPage />} />
          <Route path={appRoutes.vehicleDetails(':vehicleId')} element={<VehicleDetailsPage />} />
          <Route path={appRoutes.approvals} element={<ApprovalsPage />} />
          <Route path={appRoutes.approvalDetails(':approvalId')} element={<ApprovalDecisionPage />} />
          <Route path={appRoutes.booking} element={<BookingPage />} />
          <Route path={appRoutes.documents} element={<DocumentsPage />} />
          <Route path={appRoutes.notifications} element={<NotificationsPage />} />
          <Route path={appRoutes.loyalty} element={<LoyaltyPage />} />
          <Route path={appRoutes.profile} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? appRoutes.home : appRoutes.login} replace />} />
    </Routes>
  );
};
