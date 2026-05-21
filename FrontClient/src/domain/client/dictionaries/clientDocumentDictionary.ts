export const clientDocumentDictionary: Record<
  string,
  {
    title: string;
    description: string;
    previewHint: string;
  }
> = {
  INSPECTION_PHOTO: {
    title: 'Фото',
    description: 'Фотографии осмотра и состояния автомобиля.',
    previewHint: 'Быстро открыть фото и сверить состояние.'
  },
  DOCUMENT: {
    title: 'Документы',
    description: 'Полезные материалы по заказу и автомобилю.',
    previewHint: 'Открыть документ и проверить детали.'
  },
  ACT: {
    title: 'Акты',
    description: 'Подтверждающие документы по выполненным работам.',
    previewHint: 'Проверить итоговый акт и сохранить копию.'
  },
  ESTIMATE: {
    title: 'Сметы',
    description: 'Расчеты стоимости и согласованные оценки.',
    previewHint: 'Открыть смету и быстро сравнить суммы.'
  }
};

export const documentGroupOrder = ['INSPECTION_PHOTO', 'DOCUMENT', 'ACT', 'ESTIMATE'] as const;
