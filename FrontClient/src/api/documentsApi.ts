import { clientSelfServiceApi } from './clientSelfServiceApi';
import { FileCategory, FileItem, FileOwnerType, Order, Vehicle } from '../types/domain';

const buildOwnerKey = (ownerType: string, ownerId: string) => `${ownerType}:${ownerId}`;

export const documentsApi = {
  listAll: async (): Promise<{ filesByOwner: Record<string, FileItem[]> }> => {
    const [orders, vehicles, customerFiles] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerOrders(),
      clientSelfServiceApi.getCurrentCustomerVehicles(),
      clientSelfServiceApi.getCurrentCustomerDocuments().catch(() => [])
    ]);

    const [vehicleFileEntries, orderFileEntries] = await Promise.all([
      Promise.all(
        vehicles.map(async (vehicle) => [
          buildOwnerKey('VEHICLE', String(vehicle.id)),
          await clientSelfServiceApi.getCurrentCustomerVehicleDocuments(vehicle.id).catch(() => [])
        ] as const)
      ),
      Promise.all(
        orders.map(async (order) => [
          buildOwnerKey('ORDER', String(order.id)),
          await clientSelfServiceApi.getCurrentCustomerOrderDocuments(order.id).catch(() => [])
        ] as const)
      )
    ]);

    return {
      filesByOwner: {
        [buildOwnerKey('CUSTOMER', 'me')]: customerFiles,
        ...Object.fromEntries(vehicleFileEntries),
        ...Object.fromEntries(orderFileEntries)
      }
    };
  },
  listByOwner: async (ownerType: FileOwnerType, ownerId: string): Promise<FileItem[]> => {
    if (ownerType === 'CUSTOMER') {
      return clientSelfServiceApi.getCurrentCustomerDocuments();
    }
    if (ownerType === 'VEHICLE') {
      return clientSelfServiceApi.getCurrentCustomerVehicleDocuments(Number(ownerId));
    }
    if (ownerType === 'ORDER') {
      return clientSelfServiceApi.getCurrentCustomerOrderDocuments(Number(ownerId));
    }
    return [];
  },
  upload: async (_draft: { file: File; category: FileCategory; ownerType: FileOwnerType; ownerId: string; uploadedBy?: string; progress?: (value: number) => void }) => {
    throw new Error('CUSTOMER_FILES_UPLOAD_NOT_AVAILABLE');
  },
  getOpenUrl: async (fileId: string) => clientSelfServiceApi.getPresignedDownloadUrl(fileId),
  getDownloadUrl: async (fileId: string) => clientSelfServiceApi.getPresignedDownloadUrl(fileId),
  getUploadPolicy: () => ({
    maxSizeBytes: 0,
    allowedTypes: [],
    categories: [] as FileCategory[]
  }),
  getRelations: async (): Promise<{ orders: Order[]; vehicles: Vehicle[] }> => {
    const [orders, vehicles] = await Promise.all([
      clientSelfServiceApi.getCurrentCustomerOrders(),
      clientSelfServiceApi.getCurrentCustomerVehicles()
    ]);
    return { orders, vehicles };
  }
};
