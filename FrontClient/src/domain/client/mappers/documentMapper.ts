import { appRoutes } from '../../../app/router/routeMap';
import { FileItem, Order, Vehicle } from '../../../types/domain';
import { formatDateTime, formatFileSizeLabel } from '../formatters/clientFormatters';
import { clientDocumentDictionary, documentGroupOrder } from '../dictionaries/clientDocumentDictionary';
import { ClientDocumentGroupViewModel, ClientDocumentItemViewModel, ClientDocumentsPageViewModel } from '../view-models';

const getDocumentMeta = (category: string) =>
  clientDocumentDictionary[category] ?? {
    title: 'Документы',
    description: 'Материалы по обслуживанию и истории автомобиля.',
    previewHint: 'Открыть материал и сохранить его на устройство.'
  };

export const mapFileToClientDocument = (file: FileItem, ownerContextLabel = 'Материал сервиса'): ClientDocumentItemViewModel => {
  const meta = getDocumentMeta(file.category);
  const isImage = file.contentType.startsWith('image/');
  const resolvedId = String(file.id ?? '').trim() || `${file.ownerType}:${file.ownerId}:${file.originalFilename}:${file.createdAt}`;

  return {
    id: resolvedId,
    title: file.originalFilename,
    subtitle: `${meta.title} · ${formatDateTime(file.createdAt)}`,
    categoryLabel: meta.title,
    groupLabel: meta.title,
    sizeLabel: formatFileSizeLabel(file.sizeBytes),
    createdAtLabel: formatDateTime(file.createdAt),
    ownerContextLabel,
    previewHint: meta.previewHint,
    isImage,
    openLabel: isImage ? 'Открыть фото' : 'Открыть',
    downloadLabel: 'Скачать'
  };
};

export const mapFilesToClientDocuments = (files: FileItem[], ownerContextLabel?: string) =>
  files.map((file) => mapFileToClientDocument(file, ownerContextLabel));

export const groupClientDocuments = (documents: ClientDocumentItemViewModel[]): ClientDocumentGroupViewModel[] => {
  const grouped = documents.reduce<Record<string, ClientDocumentItemViewModel[]>>((acc, item) => {
    acc[item.groupLabel] = acc[item.groupLabel] ?? [];
    acc[item.groupLabel].push(item);
    return acc;
  }, {});

  const sortedKeys = [
    ...documentGroupOrder.map((key) => getDocumentMeta(key).title).filter((key) => grouped[key]),
    ...Object.keys(grouped).filter((key) => !documentGroupOrder.map((item) => getDocumentMeta(item).title).includes(key))
  ];

  return sortedKeys.map((key) => ({
    key,
    title: key,
    description: Object.values(clientDocumentDictionary).find((item) => item.title === key)?.description ?? 'Материалы, которые помогают быстро восстановить контекст заказа.',
    items: grouped[key]
  }));
};

export const mapDocumentsPageToClientViewModel = (params: {
  orders: Order[];
  vehicles: Vehicle[];
  filesByOwner: Record<string, FileItem[]>;
}): ClientDocumentsPageViewModel => {
  const { orders, vehicles, filesByOwner } = params;
  const orderSections = orders
    .map((order) => {
      const files = filesByOwner[`ORDER:${order.id}`] ?? [];
      if (files.length === 0) {
        return null;
      }

      const vehicle = vehicles.find((item) => item.id === order.vehicleId);
      const documents = mapFilesToClientDocuments(files, `Заказ #${order.id}`);
      return {
        id: `order-${order.id}`,
        title: `Заказ #${order.id}`,
        subtitle: order.problem,
        ownerLabel: vehicle ? `${vehicle.brand} ${vehicle.model} · ${vehicle.licensePlate}` : 'Материалы по заказу',
        actionLabel: 'Открыть заказ',
        to: appRoutes.orderDetails(order.id),
        groups: groupClientDocuments(documents),
        totalCount: documents.length
      };
    })
    .filter(Boolean);

  const vehicleSections = vehicles
    .map((vehicle) => {
      const files = filesByOwner[`VEHICLE:${vehicle.id}`] ?? [];
      if (files.length === 0) {
        return null;
      }

      const documents = mapFilesToClientDocuments(files, `${vehicle.brand} ${vehicle.model}`);
      return {
        id: `vehicle-${vehicle.id}`,
        title: `${vehicle.brand} ${vehicle.model}`,
        subtitle: `VIN ${vehicle.vin}`,
        ownerLabel: `${vehicle.licensePlate} · Материалы по автомобилю`,
        actionLabel: 'Открыть авто',
        to: appRoutes.vehicleDetails(vehicle.id),
        groups: groupClientDocuments(documents),
        totalCount: documents.length
      };
    })
    .filter(Boolean);

  return {
    sections: [...orderSections, ...vehicleSections].filter(Boolean) as ClientDocumentsPageViewModel['sections'],
    uploadPolicy: {
      maxFileSizeLabel: 'до 15 МБ',
      allowedFormatsLabel: 'JPG, PNG, PDF',
      helperText: 'Добавьте фото повреждения, документы или смету до визита — сервис быстрее поймёт контекст.'
    }
  };
};
