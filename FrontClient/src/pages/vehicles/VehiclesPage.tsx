import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Alert, Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { partsApi } from '../../api/partsApi';
import { vehiclesApi } from '../../api/vehiclesApi';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { CatalogManufacturer, CatalogModelSeries, CatalogModification } from '../../types/domain';
import { getBrandCatalogItem, vehicleBrandCatalog } from '../../utils/vehicleCatalog';
import { useVehiclesData } from '../../hooks/useVehiclesData';

const LoadingState = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" height={96} />
    <Skeleton variant="rounded" height={240} />
  </Stack>
);

const initialForm = { brand: '', model: '', vin: '', licensePlate: '' };
const catalogType = 'PC';

export const VehiclesPage = () => {
  const { loading, error, data, reload } = useVehiclesData();
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const [manufacturers, setManufacturers] = useState<CatalogManufacturer[]>([]);
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [modelSeriesOptions, setModelSeriesOptions] = useState<CatalogModelSeries[]>([]);
  const [modelSeriesLoading, setModelSeriesLoading] = useState(false);
  const [modificationOptions, setModificationOptions] = useState<CatalogModification[]>([]);
  const [modificationLoading, setModificationLoading] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<CatalogManufacturer | null>(null);
  const [selectedModelSeries, setSelectedModelSeries] = useState<CatalogModelSeries | null>(null);
  const [selectedModification, setSelectedModification] = useState<CatalogModification | null>(null);
  const [catalogTouched, setCatalogTouched] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const brandOptions = useMemo(() => vehicleBrandCatalog.map((item) => item.brand), []);
  const modelOptions = useMemo(() => getBrandCatalogItem(form.brand)?.models ?? [], [form.brand]);

  const resetModification = () => {
    setSelectedModification(null);
    setModificationOptions([]);
  };

  const resetSeriesAndModification = () => {
    setSelectedModelSeries(null);
    setModelSeriesOptions([]);
    resetModification();
  };

  useEffect(() => {
    if (!createOpen) {
      return;
    }

    let cancelled = false;
    const loadManufacturers = async () => {
      setManufacturersLoading(true);
      setCatalogError(null);
      try {
        const popular = await partsApi.getManufacturers({ type: catalogType, popular: true }).catch(() => []);
        if (popular.length > 0) {
          if (!cancelled) {
            setManufacturers(popular);
          }
          return;
        }
        const all = await partsApi.getManufacturers({ type: catalogType });
        if (!cancelled) {
          setManufacturers(all);
        }
      } catch (requestError: any) {
        if (!cancelled) {
          setCatalogError(requestError?.response?.data?.message ?? 'Каталог производителей сейчас недоступен. Базовое создание автомобиля продолжит работать.');
        }
      } finally {
        if (!cancelled) {
          setManufacturersLoading(false);
        }
      }
    };

    void loadManufacturers();
    return () => {
      cancelled = true;
    };
  }, [createOpen]);

  useEffect(() => {
    const normalizedBrand = form.brand.trim().toLowerCase();
    if (!normalizedBrand || manufacturers.length === 0 || selectedManufacturer) {
      return;
    }
    const exactManufacturer = manufacturers.find((item) => item.name.trim().toLowerCase() === normalizedBrand);
    if (!exactManufacturer) {
      return;
    }
    void handleManufacturerSelect(exactManufacturer, false);
  }, [form.brand, manufacturers]);

  useEffect(() => {
    const normalizedModel = form.model.trim().toLowerCase();
    if (!normalizedModel || modelSeriesOptions.length === 0 || selectedModelSeries) {
      return;
    }
    const exactSeries = modelSeriesOptions.find((item) => item.name.trim().toLowerCase() === normalizedModel);
    if (!exactSeries) {
      return;
    }
    void handleModelSeriesSelect(exactSeries, false);
  }, [form.model, modelSeriesOptions]);

  const handleManufacturerSelect = async (nextManufacturer: CatalogManufacturer | null, markTouched = true) => {
    setSelectedManufacturer(nextManufacturer);
    resetSeriesAndModification();
    if (markTouched) {
      setCatalogTouched(true);
    }

    if (!nextManufacturer) {
      return;
    }

    setCatalogError(null);
    setForm((current) => ({ ...current, brand: nextManufacturer.name }));
    setModelSeriesLoading(true);
    try {
      const series = await partsApi.getModelSeries({ type: catalogType, manufacturerId: nextManufacturer.manufacturerId });
      setModelSeriesOptions(series);
    } catch (requestError: any) {
      setCatalogError(requestError?.response?.data?.message ?? 'Не удалось загрузить серии выбранного производителя.');
    } finally {
      setModelSeriesLoading(false);
    }
  };

  const handleModelSeriesSelect = async (nextSeries: CatalogModelSeries | null, markTouched = true) => {
    setSelectedModelSeries(nextSeries);
    resetModification();
    if (markTouched) {
      setCatalogTouched(true);
    }

    if (!nextSeries) {
      return;
    }

    setCatalogError(null);
    setForm((current) => ({ ...current, model: nextSeries.name }));
    setModificationLoading(true);
    try {
      const modifications = await partsApi.getModifications({ type: catalogType, modelSeriesId: nextSeries.modelSeriesId });
      setModificationOptions(modifications);
    } catch (requestError: any) {
      setCatalogError(requestError?.response?.data?.message ?? 'Не удалось загрузить модификации выбранной серии.');
    } finally {
      setModificationLoading(false);
    }
  };

  const buildCatalogPayload = () => {
    if (!selectedManufacturer || !selectedModelSeries || !selectedModification) {
      return null;
    }

    return {
      type: selectedModification.type || catalogType,
      manufacturerId: selectedManufacturer.manufacturerId,
      manufacturerName: selectedManufacturer.name,
      modelSeriesId: selectedModelSeries.modelSeriesId,
      modelSeriesName: selectedModelSeries.name,
      modificationId: selectedModification.modificationId,
      modificationName: selectedModification.displayName ?? selectedModification.name,
      engineDescription: [selectedModification.engineType, selectedModification.capacityLiters ? `${selectedModification.capacityLiters}L` : null, selectedModification.fuelType]
        .filter(Boolean)
        .join(' · ') || undefined
    };
  };

  const handleCreate = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const createdVehicle = await vehiclesApi.create({
        brand: form.brand.trim(),
        model: form.model.trim(),
        vin: form.vin.trim().toUpperCase(),
        licensePlate: form.licensePlate.trim().toUpperCase()
      });

      const catalogPayload = buildCatalogPayload();
      if (catalogPayload) {
        try {
          await vehiclesApi.linkCatalog(createdVehicle.id, catalogPayload);
        } catch {
          // base vehicle is already created; optional catalog enhancement must not block save
        }
      }

      setCreateOpen(false);
      setForm(initialForm);
      setSelectedManufacturer(null);
      setSelectedModelSeries(null);
      setSelectedModification(null);
      setModelSeriesOptions([]);
      setModificationOptions([]);
      setCatalogTouched(false);
      await reload();
    } catch (requestError: any) {
      setSaveError(requestError?.response?.data?.message ?? 'Не удалось добавить автомобиль.');
    } finally {
      setSaving(false);
    }
  };

  const catalogSummary = selectedManufacturer && selectedModelSeries && selectedModification;

  if (loading) return <LoadingState />;
  if (error) return <AppAlert message={error} onRetry={() => void reload()} />;
  if (!data) return <EmptyState title="Автомобили недоступны" description="Список автомобилей появится сразу после загрузки клиентских данных." actionLabel="Повторить" onAction={() => void reload()} />;

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Vehicles self-service"
        title="Мой гараж"
        description="Теперь клиент может не только смотреть машины, но и реально управлять своим гаражом через новый self-service API."
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
        <Typography color="text.secondary">Здесь собраны все автомобили клиента, их история и быстрые переходы к сервисным действиям.</Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setCreateOpen(true)}>
          Добавить автомобиль
        </Button>
      </Stack>

      {data.vehicles.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              xl: 'repeat(2, minmax(0, 1fr))'
            }
          }}
        >
          {data.vehicles.map((vehicle) => (
            <SectionCard key={vehicle.id} title={vehicle.title} description={vehicle.subtitle} action={<Chip label={`${vehicle.activeOrdersCount ?? 0} активных`} color={(vehicle.activeOrdersCount ?? 0) > 0 ? 'warning' : 'success'} />}>
              <Stack spacing={2}>
                <Typography color="text.secondary">VIN: {vehicle.vin}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
                  <Chip label={`${vehicle.totalOrdersCount ?? 0} заказов в истории`} variant="outlined" icon={<HistoryRoundedIcon />} />
                  <Chip label={`Обновлено ${vehicle.updatedLabel}`} variant="outlined" />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button component={RouterLink} to={appRoutes.vehicleDetails(vehicle.id)} variant="contained" startIcon={<DirectionsCarRoundedIcon />}>Открыть автомобиль</Button>
                  <Button component={RouterLink} to={appRoutes.orders} variant="outlined">Открыть все заказы</Button>
                  <Button component={RouterLink} to={appRoutes.booking} variant="outlined" startIcon={<EventAvailableRoundedIcon />}>Записать машину</Button>
                </Stack>
              </Stack>
            </SectionCard>
          ))}
        </Box>
      ) : (
        <EmptyState title="Автомобили пока не добавлены" description="Теперь их можно добавить прямо из клиентского кабинета через self-service API." icon={<DirectionsCarRoundedIcon />} actionLabel="Добавить автомобиль" onAction={() => setCreateOpen(true)} />
      )}

      <Dialog open={createOpen} onClose={() => !saving && setCreateOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Добавить автомобиль</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {saveError ? <AppAlert message={saveError} /> : null}
            {catalogError ? <Alert severity="warning">{catalogError}</Alert> : null}

            <Alert severity="info">Базовые поля сохраняют автомобиль сразу. Каталожная часть ниже опционально улучшает точность данных для backend и будущего поиска деталей.</Alert>

            <Autocomplete<string, false, false, true>
              freeSolo
              options={brandOptions}
              value={form.brand || null}
              inputValue={form.brand}
              onChange={(_event, nextValue) => {
                const value = nextValue ?? '';
                setForm((current) => ({ ...current, brand: value, model: value !== current.brand ? '' : current.model }));
                setSelectedManufacturer(null);
                resetSeriesAndModification();
                setCatalogTouched(false);
              }}
              onInputChange={(_event, nextValue) => {
                setForm((current) => ({ ...current, brand: nextValue, model: current.brand !== nextValue ? '' : current.model }));
                setSelectedManufacturer(null);
                resetSeriesAndModification();
                setCatalogTouched(false);
              }}
              renderInput={(params) => <TextField {...params} label="Марка" helperText="Можно выбрать из подсказок или ввести вручную" />}
            />

            <Autocomplete<string, false, false, true>
              freeSolo
              options={modelOptions}
              value={form.model || null}
              inputValue={form.model}
              onChange={(_event, nextValue) => {
                setForm((current) => ({ ...current, model: nextValue ?? '' }));
                setSelectedModelSeries(null);
                resetModification();
                setCatalogTouched(false);
              }}
              onInputChange={(_event, nextValue) => {
                setForm((current) => ({ ...current, model: nextValue }));
                setSelectedModelSeries(null);
                resetModification();
                setCatalogTouched(false);
              }}
              renderInput={(params) => <TextField {...params} label="Модель" helperText={modelOptions.length > 0 ? 'Подсказки берутся из локального brand catalog' : 'Можно ввести вручную, если точной подсказки нет'} />}
            />

            <TextField label="VIN" value={form.vin} onChange={(event) => setForm((current) => ({ ...current, vin: event.target.value.toUpperCase() }))} />
            <TextField label="Госномер" value={form.licensePlate} onChange={(event) => setForm((current) => ({ ...current, licensePlate: event.target.value.toUpperCase() }))} />

            <Alert severity="info" icon={<SearchRoundedIcon fontSize="inherit" />}>Для точной backend-рамки заполните каскадно: производитель → серия / модель → модификация.</Alert>

            <Autocomplete<CatalogManufacturer, false, false, false>
              options={manufacturers}
              loading={manufacturersLoading}
              value={selectedManufacturer}
              onChange={(_event, nextValue) => void handleManufacturerSelect(nextValue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.manufacturerId === value.manufacturerId}
              renderInput={(params) => <TextField {...params} label="Производитель" />}
            />

            <Autocomplete<CatalogModelSeries, false, false, false>
              options={modelSeriesOptions}
              loading={modelSeriesLoading}
              value={selectedModelSeries}
              onChange={(_event, nextValue) => void handleModelSeriesSelect(nextValue)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.modelSeriesId === value.modelSeriesId}
              disabled={!selectedManufacturer}
              renderInput={(params) => <TextField {...params} label="Серия / модель" helperText={!selectedManufacturer ? 'Сначала выберите производителя' : 'Это уже серверный UMAPI catalog'} />}
            />

            <Autocomplete<CatalogModification, false, false, false>
              options={modificationOptions}
              loading={modificationLoading}
              value={selectedModification}
              onChange={(_event, nextValue) => {
                setSelectedModification(nextValue);
                setCatalogTouched(true);
              }}
              getOptionLabel={(option) => option.displayName ?? option.name}
              isOptionEqualToValue={(option, value) => option.modificationId === value.modificationId}
              disabled={!selectedModelSeries}
              renderInput={(params) => <TextField {...params} label="Точная модификация" helperText={!selectedModelSeries ? 'Сначала выберите серию / модель' : 'Отсюда backend получит точную техрамку автомобиля'} />}
            />

            {catalogSummary ? (
              <Alert severity="success" icon={<LinkRoundedIcon fontSize="inherit" />}>
                <Stack spacing={0.5}>
                  <Typography>Производитель: {selectedManufacturer.name}</Typography>
                  <Typography>Серия: {selectedModelSeries.name}</Typography>
                  <Typography>Модификация: {selectedModification.displayName ?? selectedModification.name}</Typography>
                  {selectedModification.engineType || selectedModification.capacityLiters || selectedModification.fuelType ? (
                    <Typography color="text.secondary">{[selectedModification.engineType, selectedModification.capacityLiters ? `${selectedModification.capacityLiters}L` : null, selectedModification.fuelType].filter(Boolean).join(' · ')}</Typography>
                  ) : null}
                </Stack>
              </Alert>
            ) : null}

            {!catalogSummary && catalogTouched ? (
              <Alert severity="warning">Автомобиль можно сохранить и без точной каталожной привязки, но тогда backend не получит полную техническую рамку для downstream-поиска деталей и точной модификации.</Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={saving}>Отмена</Button>
          <Button onClick={() => void handleCreate()} disabled={saving || !form.brand || !form.model || !form.vin || !form.licensePlate} variant="contained">
            {saving ? 'Сохраняем…' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
