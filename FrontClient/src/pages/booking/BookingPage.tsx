import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Alert, Box, Button, Chip, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useBookingData } from '../../hooks/useBookingData';
import { useBookingDraft } from '../../hooks/useBookingDraft';
import { BookingDayAvailability } from '../../types/domain';

const stepLabels = ['Авто', 'Услуги', 'Проблема', 'Дата и время', 'Подтверждение'];
const weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const monthTitleFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayTitleFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'long', timeZone: 'UTC' });

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const formatMonthKey = (value: string) => value.slice(0, 7);

const formatMonthLabel = (monthKey: string) => monthTitleFormatter.format(parseLocalDate(`${monthKey}-01`));

const formatDateLabel = (value: string) => {
  const title = dayTitleFormatter.format(parseLocalDate(value));
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const getMonthOptions = (days: BookingDayAvailability[]) => Array.from(new Set(days.map((item) => formatMonthKey(item.date))));

const getDayReasonLabel = (reason: BookingDayAvailability['reason']) => {
  switch (reason) {
    case 'PAST':
      return 'Дата уже прошла';
    case 'CLOSED':
      return 'Сервис закрыт';
    case 'NO_EMPLOYEE':
      return 'Нет доступных сотрудников';
    case 'FULL':
      return 'Все слоты заняты';
    default:
      return 'Нет свободных слотов';
  }
};

const buildCalendarCells = (monthKey: string, availabilityMap: Map<string, BookingDayAvailability>) => {
  const firstDay = parseLocalDate(`${monthKey}-01`);
  const year = firstDay.getUTCFullYear();
  const monthIndex = firstDay.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const firstWeekday = (firstDay.getUTCDay() + 6) % 7;
  const cells: Array<{ date: string | null; day: BookingDayAvailability | null }> = [];

  for (let offset = 0; offset < firstWeekday; offset += 1) {
    cells.push({ date: null, day: null });
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    const date = `${monthKey}-${String(dayNumber).padStart(2, '0')}`;
    cells.push({ date, day: availabilityMap.get(date) ?? null });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, day: null });
  }

  return cells;
};

export const BookingPage = () => {
  const {
    loading,
    error,
    data,
    reload,
    availabilityLoading,
    availabilityError,
    slotsLoading,
    slotsError,
    lookupAvailability,
    lookupSlots
  } = useBookingData();
  const draft = useBookingDraft();
  const [calendarDays, setCalendarDays] = useState<BookingDayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [slotOptions, setSlotOptions] = useState<Array<{ id: string; label: string; subtitle: string; badgeLabel: string | null }>>([]);

  useEffect(() => {
    if (draft.step !== 'slot' || !draft.vehicleId || draft.selectedServiceIds.length === 0) {
      return;
    }

    let cancelled = false;
    void lookupAvailability(draft.vehicleId, draft.selectedServiceIds)
      .then((days) => {
        if (cancelled) {
          return;
        }

        setCalendarDays(days);
        const firstAvailableDate = days.find((item) => item.available)?.date ?? null;
        const nextSelectedDate = selectedDate && days.some((item) => item.date === selectedDate && item.available)
          ? selectedDate
          : firstAvailableDate;

        setSelectedDate(nextSelectedDate);
        setSelectedMonthKey(nextSelectedDate ? formatMonthKey(nextSelectedDate) : getMonthOptions(days)[0] ?? null);
        setSlotOptions([]);
        draft.setSlot(null);
      })
      .catch(() => {
        if (!cancelled) {
          setCalendarDays([]);
          setSelectedDate(null);
          setSelectedMonthKey(null);
          setSlotOptions([]);
          draft.setSlot(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [draft.step, draft.vehicleId, draft.selectedServiceIds, lookupAvailability]);

  useEffect(() => {
    if (draft.step !== 'slot' || !draft.vehicleId || draft.selectedServiceIds.length === 0 || !selectedDate) {
      return;
    }

    const selectedDay = calendarDays.find((item) => item.date === selectedDate);
    if (!selectedDay?.available) {
      setSlotOptions([]);
      draft.setSlot(null);
      return;
    }

    let cancelled = false;
    draft.setSlot(null);
    void lookupSlots(draft.vehicleId, draft.selectedServiceIds, selectedDate)
      .then((slots) => {
        if (!cancelled) {
          setSlotOptions(slots);
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
  }, [calendarDays, draft.step, draft.vehicleId, draft.selectedServiceIds, selectedDate, lookupSlots]);

  const selectedVehicle = data?.vehicles.find((item) => item.id === draft.vehicleId) ?? null;
  const selectedServices = useMemo(() => data?.services.filter((item) => draft.selectedServiceIds.includes(item.id)) ?? [], [data?.services, draft.selectedServiceIds]);
  const selectedSlot = slotOptions.find((item) => item.id === draft.slot?.id) ?? null;
  const monthOptions = useMemo(() => getMonthOptions(calendarDays), [calendarDays]);
  const availabilityMap = useMemo(() => new Map(calendarDays.map((item) => [item.date, item] as const)), [calendarDays]);
  const calendarCells = useMemo(() => selectedMonthKey ? buildCalendarCells(selectedMonthKey, availabilityMap) : [], [availabilityMap, selectedMonthKey]);
  const selectedDay = selectedDate ? availabilityMap.get(selectedDate) ?? null : null;
  const selectedMonthIndex = selectedMonthKey ? monthOptions.indexOf(selectedMonthKey) : -1;

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
        eyebrow="Запись в сервис"
        title="Записаться в сервис"
        description="Сначала выберите авто и услуги, затем день в календаре, после этого — свободное время только на выбранную дату."
      />

      <Alert severity="info">Сначала выберите удобный день, затем свободное время и подтвердите запись.</Alert>

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
                      <Typography color="text.secondary">{vehicle.subtitle}</Typography>
                      <Typography variant="body2" color="text.secondary">Госномер: {vehicle.plateLabel}</Typography>
                      <Button variant={draft.vehicleId === vehicle.id ? 'contained' : 'outlined'} startIcon={<DirectionsCarRoundedIcon />} onClick={() => draft.setVehicleId(vehicle.id)} sx={{ alignSelf: 'flex-start' }}>
                        {draft.vehicleId === vehicle.id ? 'Выбрано' : 'Выбрать'}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'services' ? (
            <SectionCard title="Какие услуги нужны" description="Отметьте только то, что действительно хотите включить в запись. Выбор влияет на длительность и доступные даты.">
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
                }) : <EmptyState title="Услуги пока недоступны" description="Попробуйте обновить страницу немного позже." />}
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
            <SectionCard title="Когда удобно приехать" description="Сначала выберите день в календаре, затем увидите реальные свободные интервалы только на эту дату.">
              <Stack spacing={2.5}>
                {availabilityLoading ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography color="text.secondary">Загружаем календарь доступности…</Typography>
                  </Stack>
                ) : null}
                {availabilityError ? <Alert severity="warning">{availabilityError}</Alert> : null}

                {monthOptions.length > 0 ? (
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Typography variant="h6">{selectedMonthKey ? formatMonthLabel(selectedMonthKey) : 'Календарь'}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" size="small" disabled={selectedMonthIndex <= 0} onClick={() => setSelectedMonthKey(monthOptions[selectedMonthIndex - 1] ?? null)}>
                          Назад
                        </Button>
                        <Button variant="outlined" size="small" disabled={selectedMonthIndex < 0 || selectedMonthIndex >= monthOptions.length - 1} onClick={() => setSelectedMonthKey(monthOptions[selectedMonthIndex + 1] ?? null)}>
                          Далее
                        </Button>
                      </Stack>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 1 }}>
                      {weekdayLabels.map((label) => (
                        <Box key={label} sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">{label}</Typography>
                        </Box>
                      ))}

                      {calendarCells.map((cell, index) => {
                        if (!cell.date) {
                          return <Box key={`empty-${index}`} sx={{ minHeight: 72 }} />;
                        }

                        const isSelected = selectedDate === cell.date;
                        const isAvailable = cell.day?.available ?? false;
                        const isKnownUnavailable = Boolean(cell.day) && !isAvailable;

                        return (
                          <Button
                            key={cell.date}
                            variant={isSelected ? 'contained' : 'outlined'}
                            disabled={!isAvailable}
                            onClick={() => {
                              setSelectedDate(cell.date);
                              draft.setSlot(null);
                            }}
                            sx={{
                              minHeight: 72,
                              borderRadius: 3,
                              p: 1.25,
                              alignItems: 'flex-start',
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              opacity: isKnownUnavailable ? 0.6 : 1
                            }}
                          >
                            <Stack spacing={0.5} sx={{ width: '100%' }}>
                              <Typography fontWeight={800}>{cell.date.slice(-2)}</Typography>
                              <Typography variant="caption" color={isSelected ? 'inherit' : isAvailable ? 'success.main' : 'text.secondary'}>
                                {isAvailable ? 'Есть время' : getDayReasonLabel(cell.day?.reason ?? null)}
                              </Typography>
                            </Stack>
                          </Button>
                        );
                      })}
                    </Box>
                  </Stack>
                ) : !availabilityLoading ? (
                  <EmptyState title="Календарь пока недоступен" description="Не удалось получить окно доступности для выбранного авто и услуг." icon={<EventAvailableRoundedIcon />} />
                ) : null}

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>Выбранная дата</Typography>
                  <Typography color="text.secondary">
                    {selectedDay ? `${formatDateLabel(selectedDay.date)}${selectedDay.available ? '' : ` · ${getDayReasonLabel(selectedDay.reason)}`}` : 'Сначала выберите доступный день в календаре'}
                  </Typography>
                </Box>

                {slotsLoading ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography color="text.secondary">Подбираем свободные интервалы на выбранную дату…</Typography>
                  </Stack>
                ) : null}
                {slotsError ? <Alert severity="warning">{slotsError}</Alert> : null}

                {selectedDate && selectedDay?.available ? (
                  slotOptions.length > 0 ? (
                    <Stack spacing={1.5}>
                      {slotOptions.map((slot) => (
                        <Box key={slot.id} sx={{ p: 2, borderRadius: 4, bgcolor: draft.slot?.id === slot.id ? 'primary.50' : 'background.default', border: (theme) => `1px solid ${draft.slot?.id === slot.id ? theme.palette.primary.main : theme.palette.divider}` }}>
                          <Stack spacing={1}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                              <Typography fontWeight={800}>{slot.label}</Typography>
                              {slot.badgeLabel ? <Chip label={slot.badgeLabel} color="primary" /> : null}
                            </Stack>
                            <Typography color="text.secondary">{slot.subtitle}</Typography>
                            <Button
                              variant={draft.slot?.id === slot.id ? 'contained' : 'outlined'}
                              startIcon={<EventAvailableRoundedIcon />}
                              onClick={() => {
                                const [startAt, slotMinutes] = slot.id.split('|');
                                draft.setSlot({ id: slot.id, startAt, slotMinutes: Number(slotMinutes) });
                              }}
                              sx={{ alignSelf: 'flex-start' }}
                            >
                              {draft.slot?.id === slot.id ? 'Выбрано' : 'Выбрать'}
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  ) : !slotsLoading ? (
                    <EmptyState title="На этот день слотов нет" description="Выберите другую доступную дату в календаре." icon={<EventAvailableRoundedIcon />} />
                  ) : null
                ) : null}
              </Stack>
            </SectionCard>
          ) : null}

          {draft.step === 'confirm' ? (
            <SectionCard title="Подтверждение записи" description="Проверьте краткую сводку перед отправкой записи.">
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
                  <Typography fontWeight={700}>Дата и время</Typography>
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
                  {draft.success.orderId ? <Button component={RouterLink} to={appRoutes.orderDetails(draft.success.orderId)} variant="contained">Открыть заказ</Button> : null}
                  <Button component={RouterLink} to={appRoutes.orders} variant={draft.success.orderId ? 'outlined' : 'contained'} startIcon={<ReceiptLongRoundedIcon />}>Открыть мои записи</Button>
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
                <Typography fontWeight={700}>Дата</Typography>
                <Typography color="text.secondary">{selectedDate ? formatDateLabel(selectedDate) : 'Выберите день в календаре'}</Typography>
              </Box>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>Время</Typography>
                <Typography color="text.secondary">{selectedSlot?.label ?? 'Выберите слот записи'}</Typography>
              </Box>
            </Stack>
          </SectionCard>

          <SectionCard title="Полезно знать" description="Свободное время показывается для выбранной даты, чтобы вам было проще выбрать удобный визит.">
            <Stack spacing={1.25}>
              <Typography color="text.secondary">- список авто берётся из `GET /api/customers/me/vehicles`</Typography>
              <Typography color="text.secondary">- услуги берутся из `GET /api/customers/me/booking/services`</Typography>
              <Typography color="text.secondary">- календарь доступности строится через `GET /api/customers/me/booking/availability`</Typography>
              <Typography color="text.secondary">- слоты дня загружаются через `GET /api/customers/me/booking/slots?date=...`</Typography>
              <Typography color="text.secondary">- submit создаёт запись через `POST /api/customers/me/bookings`</Typography>
            </Stack>
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
