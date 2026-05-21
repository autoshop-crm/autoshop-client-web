const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

const parseMoney = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalizedValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : null;
};

export const formatMoney = (value?: string | number | null, fallback = 'Уточняется') => {
  const parsedValue = parseMoney(value);
  return parsedValue === null ? fallback : rubFormatter.format(parsedValue);
};

export const formatDateTime = (value?: string | null, fallback = 'Дата уточняется') => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : dateTimeFormatter.format(date);
};

export const formatDate = (value?: string | null, fallback = 'Дата уточняется') => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : dateFormatter.format(date);
};

export const formatCountLabel = (value: number, singular: string, plural: string) => `${value} ${value === 1 ? singular : plural}`;

export const formatFileSize = (sizeBytes: number) => {
  if (sizeBytes < 1024) {
    return `${sizeBytes} Б`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} КБ`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} МБ`;
};


export const formatFileSizeLabel = (sizeBytes?: number | null) => {
  if (!sizeBytes || sizeBytes <= 0) {
    return '0 КБ';
  }

  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} МБ`;
  }

  return `${Math.max(1, Math.round(sizeBytes / 1024))} КБ`;
};
