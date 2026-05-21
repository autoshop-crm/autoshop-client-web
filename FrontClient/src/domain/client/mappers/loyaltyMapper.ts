import { appRoutes } from '../../../app/router/routeMap';
import { LoyaltyAccount, LoyaltyLedgerEntry, Order } from '../../../types/domain';
import { formatDateTime, formatMoney } from '../formatters/clientFormatters';
import { ClientLoyaltyLedgerItemViewModel, ClientLoyaltyOrderImpactViewModel, ClientLoyaltyPageViewModel, ClientLoyaltyViewModel } from '../view-models';

export const mapLoyaltyToClientViewModel = (loyalty: LoyaltyAccount, orderPointsSpent?: number | null): ClientLoyaltyViewModel => ({
  balanceLabel: `${loyalty.pointsBalance} бонусов`,
  tierLabel: loyalty.currentTierName ?? 'Базовый уровень',
  earnedLabel: `${loyalty.totalPointsEarned} начислено`,
  spentLabel: `${loyalty.totalPointsSpent} списано`,
  orderBenefitLabel: orderPointsSpent && orderPointsSpent > 0 ? `${orderPointsSpent} бонусов уже уменьшили стоимость заказа` : 'Бонусы готовы к использованию в следующих заказах'
});

const mapLedgerItem = (item: LoyaltyLedgerEntry): ClientLoyaltyLedgerItemViewModel => ({
  id: item.id,
  title: item.title,
  description: item.description ?? 'Изменение баланса по программе лояльности.',
  pointsLabel: `${item.points > 0 ? '+' : ''}${item.points} бонусов`,
  createdAtLabel: formatDateTime(item.createdAt),
  tone: item.points >= 0 ? 'success' : 'warning',
  orderCtaLabel: item.orderId ? 'Открыть заказ' : null,
  orderId: item.orderId ?? null
});

const mapOrderImpact = (order: Order): ClientLoyaltyOrderImpactViewModel | null => {
  const pointsSpent = order.loyaltyPointsSpent ?? 0;
  const pointsDiscount = order.pointsDiscountAmount ? formatMoney(order.pointsDiscountAmount) : null;
  if (!pointsSpent && !pointsDiscount) {
    return null;
  }

  return {
    orderId: order.id,
    title: `Заказ #${order.id}`,
    benefitLabel: pointsDiscount ? `Экономия ${pointsDiscount}` : `${pointsSpent} бонусов использовано`,
    totalLabel: formatMoney(order.finalAmount),
    summary: pointsDiscount ? `${pointsSpent} бонусов уменьшили стоимость обслуживания.` : 'Бонусы повлияли на финальную сумму заказа.',
    to: appRoutes.orderDetails(order.id)
  };
};

export const mapLoyaltyPageToClientViewModel = (params: {
  loyalty: LoyaltyAccount;
  ledger: LoyaltyLedgerEntry[];
  orders: Order[];
}): ClientLoyaltyPageViewModel => {
  const { loyalty, ledger, orders } = params;
  const impactCards = orders.map(mapOrderImpact).filter(Boolean) as ClientLoyaltyOrderImpactViewModel[];
  const activeImpact = impactCards[0] ?? null;

  return {
    overview: mapLoyaltyToClientViewModel(loyalty, orders.find((item) => (item.loyaltyPointsSpent ?? 0) > 0)?.loyaltyPointsSpent ?? null),
    explanation: 'Бонусы здесь показывают только клиентскую пользу: сколько доступно сейчас, где уже сработала выгода и как это влияет на стоимость обслуживания.',
    currentBenefitLabel: activeImpact?.benefitLabel ?? 'Бонусы пока не применялись к активным заказам',
    impactCards,
    ledger: ledger
      .slice()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map(mapLedgerItem)
  };
};
