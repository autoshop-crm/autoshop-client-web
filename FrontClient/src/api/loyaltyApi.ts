import { clientSelfServiceApi, mapLoyaltyOverviewToLegacy } from './clientSelfServiceApi';
import { LoyaltyAccount, LoyaltyLedgerEntry, Order } from '../types/domain';

interface LoyaltyPayload {
  loyalty: LoyaltyAccount | null;
  ledger: LoyaltyLedgerEntry[];
  orders: Order[];
}

export const loyaltyApi = {
  getOverview: async (): Promise<LoyaltyPayload> => {
    const [loyaltyPayload, orders] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerLoyalty(),
      clientSelfServiceApi.getCurrentCustomerOrders()
    ]);
    const mapped = mapLoyaltyOverviewToLegacy(loyaltyPayload);
    return {
      loyalty: mapped.loyalty,
      ledger: mapped.ledger,
      orders
    };
  }
};
