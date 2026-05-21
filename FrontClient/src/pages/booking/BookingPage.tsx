import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import { Alert, Box, Button, Chip, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';
import { useBookingData } from '../../hooks/useBookingData';
import { useBookingDraft } from '../../hooks/useBookingDraft';

const stepLabels = ['Авто', 'Услуги', 'Проблема', 'Время', 'Подтверждение'];

export const BookingPage = () => {
  const { loading, error, data, reload, lookupSlots, slotsLoading, slotsError } = useBookingData();
  const draft = useBookingDraft();
  const [slotOptions, setSlotOptions] = useState<Array<{ id: string; label: string; subtitle: string; badgeLabel: string | null }>>([]);

  useEffect(() => {
    if (draft.step !== 'slot' || !draft.vehicleId || draft.selectedServiceIds.length === 0) {
      return;
    }

    let cancelled = false;
    void lookupSlots(draft.vehicleId, draft.selectedServiceIds)
      .then((slots) => {
        if (!cancelled) {
          setSlotOptions(slots);
          if (slots.length === 0) {
            draft.setSlot(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlotOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [draft.step, draft.vehicleId, draft.selectedServiceIds, lookupSlots]);

  const selectedVehicle = data?.vehicles.find((item) => item.id === draft.vehicleId) ?? null;
  const selectedServices = useMemo(() => data?.services.filter((item) => draft.selectedServiceIds.includes(item.id)) ?? [], [data?.services, draft.selectedServiceIds]);
  const selectedSlot = slotOptions.find((item) => item.id === draft.slot?.id) ?? null;

  if (loading) {
    return <AppLoader />;
  }

  if (error || !data) {
    return <AppAlert message={error ?? 'Не удалось открыть запись в сервис.'} onRetry={() => void reload()} />;
  }

  if (data.vehicles.length === 0) {
    return <AppAlert message="Для записи сначала добавьте автомобиль в гараж клиента." onRetry={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Booking self-service"
        title="Записаться в сервис"
        description="Запись занимает несколько коротких шагов: выберите авто, услуги, опишите задачу и выберите удобное время."
      />

      <Alert severity="info">Новый backend уже поддерживает customer-safe подбор услуг, слотов и создание booking без staff namespace.</Alert>

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.15fr 0.85fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Шаги записи" description={data.explanatoryCopy}>
            <Stack spacing={2}>
              <LinearProgress variant="determinate" value={draft.step === 'success' ? 100 : ((draft.currentIndex + 1) / stepLabels.length) * 100} />
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {stepLabels.map((label, index) => (
                  <Chip key={label} label={`${index + 1}. ${label}`} color={draft.currentIndex === index ? 'primary' : 'default'} variant={draft.currentIndex >= index ? 'filled' : 'outlined'} />
                ))}
              </Stack>
            </Stack>
          </SectionCard>

          {draft.step === 'vehicle' ? (
            <SectionCard title="Какой автомобиль записываем" description="Сначала выберите автомобиль из своего гаража. Добавление новых авто вынесено в отдельный экран, чтобы запись оставалась быстрой.">
              <Stack spacing={1.5}>
                {data.vehicles.map((vehicle) => (
                  <Box key={vehicle.id} sx={{ p: 2, borderRadius: 4, bgcolor: draft.vehicleId === vehicle.id ? 'primary.50' : 'background.default', border: (theme) => `1px solid ${draft.vehicleId === vehicle.id ? theme.palette.primary.main : theme.palette.divider}` }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={800}>{vehicle.title}</Typography>
                      <Typography color="text.secondary">{vehicle.plateLabel}</Typography>
                      <Typography variant="body2" color="text.secondary">{vehicle.subtitle}</Typography>
                      <Button variant={draft.vehicleId === vehicle.id ? 'contained' : 'outlined'} startIcon={<DirectionsCarRoundedIcon />} onClick={() => draft.setVehicleId(vehicle.id)} sx={{ alignSelf: 'flex-start' }}>
                        {draft.vehicleId === vehicle.id ? 'Выбрано' : 'Выбрать'}
                      </Button>
                    </Stack>
                  </Box>
                ))}
                <Button component={RouterLink} to={appRoutes.vehicles} variant="text" sx={{ alignSelf: 'flex-start' }}>
                  Управлять гаражом
                </Button>
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'services' ? (
            <SectionCard title="Какие услуги нужны" description="Выберите работы, чтобы backend подобрал релевантную длительность и свободные интервалы.">
              <Stack spacing={1.5}>
                {data.services.length > 0 ? data.services.map((service) => {
                  const selected = draft.selectedServiceIds.includes(service.id);
                  return (
                    <Box key={service.id} sx={{ p: 2, borderRadius: 4, bgcolor: selected ? 'primary.50' : 'background.default', border: (theme) => `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}` }}>
                      <Stack spacing={1}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                          <Typography fontWeight={800}>{service.title}</Typography>
                          {service.metaLabel ? <Chip label={service.metaLabel} color={selected ? 'primary' : 'default'} /> : null}
                        </Stack>
                        <Typography color="text.secondary">{service.subtitle}</Typography>
                        <Button variant={selected ? 'contained' : 'outlined'} startIcon={<BuildCircleRoundedIcon />} onClick={() => draft.toggleService(service.id)} sx={{ alignSelf: 'flex-start' }}>
                          {selected ? 'Выбрано' : 'Добавить'}
                        </Button>
                      </Stack>
                    </Box>
                  );
                }) : <EmptyState title="Услуги пока недоступны" description="Backend не вернул customer-safe service catalog." />}
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'problem' ? (
            <SectionCard title="Что нужно сделать" description="Коротко опишите проблему или задачу. Этого достаточно для первичного понимания обращения.">
              <Stack spacing={2}>
                <textarea value={draft.problem} onChange={(event) => draft.setProblem(event.target.value)} rows={5} style={{ width: '100%', padding: 16, borderRadius: 16, borderColor: '#d0d7de', resize: 'vertical', font: 'inherit' }} placeholder="Например: шум при торможении, нужна диагностика подвески, замена масла и фильтров" />
                <textarea value={draft.comment} onChange={(event) => draft.setComment(event.target.value)} rows={3} style={{ width: '100%', padding: 16, borderRadius: 16, borderColor: '#d0d7de', resize: 'vertical', font: 'inherit' }} placeholder="Дополнительно: удобное время, важные детали, пожелания по приёму" />
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'slot' ? (
            <SectionCard title="Когда удобно приехать" description="Слоты берутся из нового customer-safe lookup API и показывают только реальные доступные интервалы.">
              <Stack spacing={2}>
                {slotsLoading ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography color="text.secondary">Подбираем свободные интервалы…</Typography>
                  </Stack>
                ) : null}
                {slotsError ? <Alert severity="warning">{slotsError}</Alert> : null}
                {slotOptions.length > 0 ? (
                  slotOptions.map((slot) => (
                    <Box key={slot.id} sx={{ p: 2, borderRadius: 4, bgcolor: draft.slot?.id === slot.id ? 'primary.50' : 'background.default', border: (theme) => `1px solid ${draft.slot?.id === slot.id ? theme.palette.primary.main : theme.palette.divider}` }}>
                      <Stack spacing={1}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                          <Typography fontWeight={800}>{slot.label}</Typography>
                          {slot.badgeLabel ? <Chip label={slot.badgeLabel} color="primary" /> : null}
                        </Stack>
                        <Typography color="text.secondary">{slot.subtitle}</Typography>
                        <Button variant={draft.slot?.id === slot.id ? 'contained' : 'outlined'} startIcon={<EventAvailableRoundedIcon />} onClick={() => {
                          const [startAt, slotMinutes] = slot.id.split('|');
                          draft.setSlot({ id: slot.id, startAt, slotMinutes: Number(slotMinutes) });
                        }} sx={{ alignSelf: 'flex-start' }}>
                          {draft.slot?.id === slot.id ? 'Выбрано' : 'Выбрать'}
                        </Button>
                      </Stack>
                    </Box>
                  ))
                ) : !slotsLoading ? (
                  <EmptyState title="Свободных слотов пока нет" description="Попробуйте поменять авто или набор услуг — это влияет на длительность и доступные окна записи." icon={<EventAvailableRoundedIcon />} />
                ) : null}
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'confirm' ? (
            <SectionCard title="Подтверждение записи" description="Проверьте краткую сводку. После подтверждения backend создаст реальный заказ в self-service namespace.">
              <Stack spacing={2}>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>Автомобиль</Typography>
                  <Typography color="text.secondary">{selectedVehicle ? `${selectedVehicle.title} · ${selectedVehicle.plateLabel}` : 'Не выбран'}</Typography>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>Услуги</Typography>
                  <Typography color="text.secondary">{selectedServices.length > 0 ? selectedServices.map((item) => item.title).join(', ') : 'Не выбраны'}</Typography>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>Проблема</Typography>
                  <Typography color="text.secondary">{draft.problem}</Typography>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>Время</Typography>
                  <Typography color="text.secondary">{selectedSlot?.label ?? 'Слот не выбран'}</Typography>
                </Box>
                {draft.error ? <Alert severity="error">{draft.error}</Alert> : null}
                <Button variant="contained" size="large" disabled={draft.submitting} onClick={() => void draft.submit()} startIcon={<TaskAltRoundedIcon />}>
                  {draft.submitting ? 'Оформляем запись…' : 'Подтвердить запись'}
                </Button>
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'success' && draft.success ? (
            <SectionCard title={draft.success.title} description={draft.success.description}>
              <Stack spacing={2}>
                <Chip label={draft.success.bookingId} color="success" sx={{ alignSelf: 'flex-start' }} />
                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>{draft.success.vehicleLabel}</Typography>
                  <Typography color="text.secondary">{draft.success.slotLabel}</Typography>
                </Box>
                <Typography color="text.secondary">{draft.success.nextStep}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button component={RouterLink} to={appRoutes.orderDetails(draft.success.orderId)} variant="contained">Открыть заказ</Button>
                  <Button component={RouterLink} to={appRoutes.orders} variant="outlined" startIcon={<ReceiptLongRoundedIcon />}>Открыть все заказы</Button>
                </Stack>
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step !== 'success' ? (
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5} justifyContent="space-between">
              <Button variant="text" disabled={draft.currentIndex <= 0} onClick={draft.back}>Назад</Button>
              <Button variant="contained" disabled={!draft.canContinue} onClick={draft.next}>Продолжить</Button>
            </Stack>
          ) : null}
        </Stack>

        <Stack spacing={3}>
          <SectionCard title="Кратко по записи" description="Справа остаётся только то, что действительно влияет на решение клиента.">
            <Stack spacing={1.5}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>Автомобиль</Typography>
                <Typography color="text.secondary">{selectedVehicle ? `${selectedVehicle.title} · ${selectedVehicle.plateLabel}` : 'Ещё не выбран'}</Typography>
              </Box>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>Услуги</Typography>
                <Typography color="text.secondary">{selectedServices.length > 0 ? selectedServices.map((item) => item.title).join(', ') : 'Ничего не выбрано'}</Typography>
              </Box>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>Время</Typography>
                <Typography color="text.secondary">{selectedSlot?.label ?? 'Выберите слот записи'}</Typography>
              </Box>
            </Stack>
          </SectionCard>

          <SectionCard title="Что уже реально работает" description="Этот экран теперь использует новый backend self-service API, а не mock flow.">
            <Stack spacing={1.25}>
              <Typography color="text.secondary">- список авто берётся из `GET /api/customers/me/vehicles`</Typography>
              <Typography color="text.secondary">- услуги берутся из `GET /api/customers/me/booking/services`</Typography>
              <Typography color="text.secondary">- слоты ищутся через `GET /api/customers/me/booking/slots`</Typography>
              <Typography color="text.secondary">- submit создаёт booking через `POST /api/customers/me/bookings`</Typography>
            </Stack>
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
