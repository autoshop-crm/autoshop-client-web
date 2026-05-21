import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { DocumentGroupsCard } from '../../components/DocumentGroupsCard';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';
import { vehiclesApi } from '../../api/vehiclesApi';
import { useDocumentActions } from '../../hooks/useDocumentActions';
import { useVehicleDetailsData } from '../../hooks/useVehicleDetailsData';

export const VehicleDetailsPage = () => {
  const params = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const vehicleId = params.vehicleId ? Number(params.vehicleId) : undefined;
  const { loading, error, data, reload } = useVehicleDetailsData(vehicleId);
  const actions = useDocumentActions(reload);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const form = useMemo(() => ({
    brand: data?.vehicle.title.split(' ')[0] ?? '',
    model: data?.vehicle.title.split(' ').slice(1).join(' ') ?? '',
    vin: data?.vehicle.vin ?? '',
    licensePlate: data?.vehicle.licensePlate ?? ''
  }), [data]);
  const [draft, setDraft] = useState(form);

  const openResolvedUrl = async (resolver: () => Promise<string | void>, download = false) => {
    const url = await resolver();
    if (!url) {
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (download) {
      link.download = '';
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpen = async (fileId: string) => {
    await openResolvedUrl(() => actions.openDocument(fileId));
  };

  const handleDownload = async (fileId: string) => {
    await openResolvedUrl(() => actions.downloadDocument(fileId), true);
  };

  const openEdit = () => {
    setDraft(form);
    setSaveError(null);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!vehicleId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await vehiclesApi.update(vehicleId, draft);
      setEditOpen(false);
      await reload();
    } catch (requestError: any) {
      setSaveError(requestError?.response?.data?.message ?? 'Не удалось сохранить автомобиль.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicleId) return;
    setSaving(true);
    setDeleteError(null);
    try {
      await vehiclesApi.delete(vehicleId);
      navigate(appRoutes.vehicles);
    } catch (requestError: any) {
      setDeleteError(requestError?.response?.data?.message ?? 'Не удалось удалить автомобиль. Возможно, по нему есть активные заказы.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  if (error || !data) {
    return <AppAlert message={error ?? 'Попробуйте обновить страницу ещё раз.'} onRetry={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro eyebrow="Vehicle details" title={data.vehicle.title} description="Карточка автомобиля показывает только полезный клиенту контекст: история заказов, активные обращения и материалы по машине." />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={openEdit}>Редактировать</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => void handleDelete()} disabled={saving}>Удалить автомобиль</Button>
      </Stack>
      {deleteError ? <Alert severity="warning">{deleteError}</Alert> : null}

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.2fr 0.8fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Карточка автомобиля" description="Машина должна восприниматься как отдельная клиентская сущность, а не как техническая строка из CRM.">
            <Stack spacing={1.25}>
              <Typography fontWeight={800}>{data.vehicle.title}</Typography>
              <Typography color="text.secondary">{data.vehicle.subtitle}</Typography>
              <Typography color="text.secondary">VIN: {data.vehicle.vin}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`${data.vehicle.activeOrdersCount ?? 0} активных заказов`} color={(data.vehicle.activeOrdersCount ?? 0) > 0 ? 'warning' : 'success'} />
                <Chip label={`${data.vehicle.totalOrdersCount ?? 0} заказов в истории`} variant="outlined" />
              </Stack>
            </Stack>
          </SectionCard>

          <SectionCard title="Активные заказы" description="Если по машине уже идёт работа или есть ближайший визит, клиент видит это сразу.">
            {data.activeOrders.length > 0 ? (
              <Stack spacing={1.5}>
                {data.activeOrders.map((order) => (
                  <Box key={order.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{order.title}</Typography>
                      <Typography color="text.secondary">{order.problemSummary}</Typography>
                      <Chip label={order.statusLabel} color={order.isAttentionRequired ? 'warning' : 'primary'} sx={{ alignSelf: 'flex-start' }} />
                      <Button component={RouterLink} to={appRoutes.orderDetails(order.id)} variant="outlined" startIcon={<ReceiptLongRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                        Открыть заказ
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Активных заказов нет" description="Когда по этой машине появится новая запись или начнётся работа, заказ сразу появится в этом блоке." icon={<ReceiptLongRoundedIcon />} />
            )}
          </SectionCard>

          <SectionCard title="История заказов" description="История обслуживания по автомобилю должна открываться быстро и помогать вернуться к нужному заказу в 1–2 клика.">
            {data.archivedOrders.length > 0 ? (
              <Stack spacing={1.5}>
                {data.archivedOrders.map((order) => (
                  <Box key={order.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{order.title}</Typography>
                      <Typography color="text.secondary">{order.problemSummary}</Typography>
                      <Typography variant="body2" color="text.secondary">Итог {order.priceSummary.totalLabel}</Typography>
                      <Button component={RouterLink} to={appRoutes.orderDetails(order.id)} variant="text" sx={{ alignSelf: 'flex-start' }}>
                        Открыть историю заказа
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="История по машине пока пуста" description="После первых завершённых заказов здесь появится вся история обслуживания автомобиля." />
            )}
          </SectionCard>
        </Stack>

        <Stack spacing={3}>
          <DocumentGroupsCard
            title="Фото и документы"
            description="Материалы по машине и связанным заказам остаются trust layer: фото, сметы, акты и полезные документы можно быстро открыть и скачать."
            groups={data.documentGroups}
            emptyTitle="Документов пока нет"
            emptyDescription="Фото и документы по машине появятся здесь после визитов и работ в сервисе."
            onOpen={handleOpen}
            onDownload={handleDownload}
            busyFileId={actions.busyFileId}
          />

          <Alert severity="info">Через новый customer API здесь уже работают чтение и скачивание документов. Upload для клиента backend пока не открыл.</Alert>

          <SectionCard title="Что можно сделать дальше" description="CTA по автомобилю остаются сервисными и короткими: открыть заказы, вернуться к списку или перейти к записи.">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
              <Button component={RouterLink} to={appRoutes.orders} variant="contained" startIcon={<ReceiptLongRoundedIcon />}>Открыть заказы</Button>
              <Button component={RouterLink} to={appRoutes.vehicles} variant="outlined" startIcon={<DirectionsCarRoundedIcon />}>К списку автомобилей</Button>
            </Stack>
          </SectionCard>
        </Stack>
      </Box>

      <Dialog open={editOpen} onClose={() => !saving && setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Редактировать автомобиль</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {saveError ? <Alert severity="warning">{saveError}</Alert> : null}
            <TextField label="Марка" value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))} />
            <TextField label="Модель" value={draft.model} onChange={(event) => setDraft((current) => ({ ...current, model: event.target.value }))} />
            <TextField label="VIN" value={draft.vin} onChange={(event) => setDraft((current) => ({ ...current, vin: event.target.value }))} />
            <TextField label="Госномер" value={draft.licensePlate} onChange={(event) => setDraft((current) => ({ ...current, licensePlate: event.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={saving}>Отмена</Button>
          <Button onClick={() => void handleSave()} disabled={saving || !draft.brand || !draft.model || !draft.vin || !draft.licensePlate} variant="contained">
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
