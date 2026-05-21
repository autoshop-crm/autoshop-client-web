import { http } from './http';
import { CatalogManufacturer, CatalogModelSeries, CatalogModification } from '../types/domain';

const customerVehicleCatalogBase = '/api/customers/me/vehicles/catalog';

export const partsApi = {
  getManufacturers: async (params?: { type?: string; popular?: boolean }) => {
    const { data } = await http.get<CatalogManufacturer[]>(`${customerVehicleCatalogBase}/manufacturers`, { params });
    return data;
  },
  getModelSeries: async (params: { type?: string; manufacturerId: number }) => {
    const { data } = await http.get<CatalogModelSeries[]>(`${customerVehicleCatalogBase}/model-series`, { params });
    return data;
  },
  getModifications: async (params: { type?: string; modelSeriesId: number }) => {
    const { data } = await http.get<CatalogModification[]>(`${customerVehicleCatalogBase}/modifications`, { params });
    return data;
  }
};
