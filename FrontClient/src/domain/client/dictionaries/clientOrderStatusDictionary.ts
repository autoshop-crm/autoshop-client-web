import { ClientVisualTone } from '../view-models';
import { OrderStatus } from '../../../types/domain';

export interface ClientOrderStatusDictionaryItem {
  label: string;
  description: string;
  nextAction: string;
  tone: ClientVisualTone;
  attentionRequired: boolean;
}

const defaultStatus: ClientOrderStatusDictionaryItem = {
  label: 'Статус обновляется',
  description: 'Мы обновляем информацию по заказу.',
  nextAction: 'Откройте заказ позже, чтобы увидеть актуальные детали.',
  tone: 'neutral',
  attentionRequired: false
};

export const clientOrderStatusDictionary: Partial<Record<OrderStatus, ClientOrderStatusDictionaryItem>> = {
  WAITING_FOR_VISIT: {
    label: 'Запись оформлена',
    description: 'Визит подтверждён, ждём автомобиль в сервисе.',
    nextAction: 'Приезжайте в назначенное время.',
    tone: 'info',
    attentionRequired: false
  },
  ACCEPTED: {
    label: 'Автомобиль принят',
    description: 'Машина уже в сервисе, команда начала обработку заказа.',
    nextAction: 'Сейчас от вас ничего не требуется.',
    tone: 'info',
    attentionRequired: false
  },
  DIAGNOSIS_IN_PROGRESS: {
    label: 'Идёт диагностика',
    description: 'Мы проверяем автомобиль и уточняем объём работ.',
    nextAction: 'Если потребуются дополнительные работы, мы попросим подтверждение.',
    tone: 'warning',
    attentionRequired: false
  },
  WAITING_FOR_OWNER_APPROVAL: {
    label: 'Нужно ваше подтверждение',
    description: 'Мы нашли дополнительные работы и ждём вашего решения.',
    nextAction: 'Откройте согласование и подтвердите или отклоните работы.',
    tone: 'warning',
    attentionRequired: true
  },
  WAITING_FOR_PART: {
    label: 'Ожидаем запчасти',
    description: 'Нужные детали уже в работе, заказ продолжится после поступления.',
    nextAction: 'Пока от вас ничего не требуется.',
    tone: 'warning',
    attentionRequired: false
  },
  REPAIR_IN_PROGRESS: {
    label: 'Автомобиль в работе',
    description: 'Команда выполняет подтверждённые работы.',
    nextAction: 'Мы сообщим, когда появятся обновления.',
    tone: 'info',
    attentionRequired: false
  },
  READY_FOR_OWNER: {
    label: 'Можно забирать автомобиль',
    description: 'Работы завершены, автомобиль готов к выдаче.',
    nextAction: 'Свяжитесь с сервисом или приезжайте за машиной.',
    tone: 'success',
    attentionRequired: true
  },
  HANDED_OVER: {
    label: 'Автомобиль выдан',
    description: 'Заказ завершён, автомобиль уже передан владельцу.',
    nextAction: 'Вы можете посмотреть историю работ и документы.',
    tone: 'success',
    attentionRequired: false
  },
  CANCELLED_NO_SHOW: {
    label: 'Запись отменена',
    description: 'Визит не состоялся.',
    nextAction: 'При необходимости оформите новую запись.',
    tone: 'error',
    attentionRequired: false
  },
  CANCELLED_BY_CUSTOMER: {
    label: 'Отменено вами',
    description: 'Заказ или запись были отменены по вашему запросу.',
    nextAction: 'Вы можете создать новую запись в удобное время.',
    tone: 'error',
    attentionRequired: false
  },
  CANCELLED_INTERNAL: {
    label: 'Заказ отменён',
    description: 'Заказ был остановлен сервисом.',
    nextAction: 'Свяжитесь с сервисом, если хотите уточнить детали.',
    tone: 'error',
    attentionRequired: true
  },
  COMPLETED: {
    label: 'Работы завершены',
    description: 'Основные работы по заказу завершены.',
    nextAction: 'Проверьте итоговую стоимость и документы.',
    tone: 'success',
    attentionRequired: false
  },
  NEW: {
    label: 'Новая заявка',
    description: 'Заявка зарегистрирована и ожидает обработки.',
    nextAction: 'Мы скоро подтвердим дальнейшие шаги.',
    tone: 'info',
    attentionRequired: false
  },
  IN_PROGRESS: {
    label: 'Заказ в работе',
    description: 'Заказ уже взят в работу.',
    nextAction: 'Ожидайте следующего обновления.',
    tone: 'info',
    attentionRequired: false
  },
  CANCELLED: {
    label: 'Заказ отменён',
    description: 'Заказ был отменён.',
    nextAction: 'Если нужно, оформите новую запись.',
    tone: 'error',
    attentionRequired: false
  }
};

export const getClientOrderStatusMeta = (status: OrderStatus): ClientOrderStatusDictionaryItem => clientOrderStatusDictionary[status] ?? defaultStatus;
