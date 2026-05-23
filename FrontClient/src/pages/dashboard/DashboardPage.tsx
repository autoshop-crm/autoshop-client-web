import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Button, Chip, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardLoadingState = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" height={92} />
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          lg: 'minmax(0, 1.6fr) minmax(320px, 1fr)'
        }
      }}
    >
      <Skeleton variant="rounded" height={280} />
      <Skeleton variant="rounded" height={280} />
    </Box>
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          xl: 'repeat(3, minmax(0, 1fr))'
        }
      }}
    >
      <Skeleton variant="rounded" height={240} />
      <Skeleton variant="rounded" height={240} />
      <Skeleton variant="rounded" height={240} />
    </Box>
  </Stack>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useDashboardData();

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error) {
    return <AppAlert message={error} onRetry={() => void reload()} />;
  }

  if (!data) {
    return <EmptyState title="Данные пока недоступны" description="Dashboard подключится автоматически, как только сервисный кабинет получит клиентские данные." actionLabel="Повторить" onAction={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Dashboard MVP"
        title="Ваш сервисный кабинет"
        description="Главный экран теперь показывает только личный контекст клиента: активный заказ, согласования, ближайшие действия, машины и бонусы — без operational шума."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.7fr) minmax(320px, 1fr)'
          }
        }}
      >
        <SectionCard
          title={data.activeOrder?.title ?? 'Сейчас нет активного заказа'}
          description={data.activeOrder?.statusDescription ?? 'Как только появится активный заказ или ближайшая запись, они сразу появятся на главном экране.'}
          action={
            data.activeOrder ? (
              <Chip
                icon={data.activeOrder.isAttentionRequired ? <WarningAmberRoundedIcon /> : <BoltRoundedIcon />}
                label={data.activeOrder.statusLabel}
                color={data.activeOrder.isAttentionRequired ? 'warning' : 'primary'}
              />
            ) : undefined
          }
        >
          {data.activeOrder ? (
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography fontWeight={700}>{data.activeOrder.vehicleSummary}</Typography>
                <Typography color="text.secondary">{data.activeOrder.problemSummary}</Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
              >
                <Chip label={`Визит ${data.activeOrder.scheduledAt}`} icon={<CalendarMonthRoundedIcon />} variant="outlined" />
                <Chip label={`Итог ${data.activeOrder.priceSummary.totalLabel}`} color="success" variant="outlined" />
                {data.activeOrder.priceSummary.discountLabel ? <Chip label={data.activeOrder.priceSummary.discountLabel} variant="outlined" /> : null}
                {data.activeOrder.priceSummary.pointsLabel ? <Chip label={data.activeOrder.priceSummary.pointsLabel} color="primary" variant="outlined" /> : null}
              </Stack>

              <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'primary.light' }}>
                <Typography fontWeight={700} color="primary.dark">Что делать дальше</Typography>
                <Typography color="primary.dark">{data.activeOrder.nextAction}</Typography>
              </Box>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">Последние важные события</Typography>
                {data.activeOrder.timelinePreview.map((timelineEvent) => (
                  <Box key={timelineEvent.id}>
                    <Typography fontWeight={700}>{timelineEvent.title}</Typography>
                    <Typography color="text.secondary">{timelineEvent.description}</Typography>
                    <Typography variant="body2" color="text.secondary">{timelineEvent.occurredAtLabel}</Typography>
                  </Box>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={RouterLink} to={appRoutes.orders} variant="contained" startIcon={<ReceiptLongRoundedIcon />}>Открыть заказ</Button>
                <Button component={RouterLink} to={appRoutes.approvals} variant="outlined" startIcon={<TaskAltRoundedIcon />}>Перейти к согласованиям</Button>
              </Stack>
            </Stack>
          ) : (
            <EmptyState
              title="Активных заказов пока нет"
              description="Когда вы оформите запись или начнётся новый заказ, здесь сразу появится статус и следующее действие."
              actionLabel="Мои автомобили"
              onAction={() => navigate(appRoutes.vehicles)}
            />
          )}
        </SectionCard>

        <SectionCard title="Что важно сейчас" description="Главный экран помогает быстро дойти до нужного действия за 1–3 клика.">
          <Stack spacing={2}>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography fontWeight={700}>Открытые согласования</Typography>
              <Typography color="text.secondary">
                {data.pendingApprovals.length > 0
                  ? `Сейчас ждут решения ${data.pendingApprovals.length} согласования.`
                  : 'Открытых согласований сейчас нет.'}
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography fontWeight={700}>Ближайшая запись</Typography>
              <Typography color="text.secondary">{data.activeOrder?.scheduledAt ?? 'Дата записи появится здесь после оформления визита.'}</Typography>
            </Box>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography fontWeight={700}>Документы и фото</Typography>
              <Typography color="text.secondary">{data.activeOrder?.documentsSummary.primaryLabel ?? 'Документы появятся по мере обновлений сервиса.'}</Typography>
            </Box>
          </Stack>
        </SectionCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'repeat(3, minmax(0, 1fr))'
          }
        }}
      >
        <SectionCard title="Нужно ваше решение" description="Самые денежные и требующие реакции элементы вынесены в отдельный видимый блок.">
          {data.pendingApprovals.length > 0 ? (
            <Stack spacing={1.5}>
              {data.pendingApprovals.map((approval) => (
                <Box key={approval.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>{approval.title}</Typography>
                  <Typography color="text.secondary">{approval.summary}</Typography>
                  <Typography variant="body2">{approval.totalAmountLabel} · {approval.requestedAtLabel}</Typography>
                </Box>
              ))}
              <Button component={RouterLink} to={appRoutes.approvals} variant="contained" startIcon={<TaskAltRoundedIcon />}>Открыть согласования</Button>
            </Stack>
          ) : (
            <EmptyState title="Согласования не требуются" description="Если сервис предложит дополнительные работы, запрос появится здесь сразу и без лишних переходов." icon={<TaskAltRoundedIcon />} />
          )}
        </SectionCard>

        <SectionCard title="Мои автомобили" description="Машины клиента остаются отдельной быстрой точкой входа в историю обслуживания.">
          {data.vehicles.length > 0 ? (
            <Stack spacing={1.5}>
              {data.vehicles.map((vehicle) => (
                <Box key={vehicle.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Typography fontWeight={700}>{vehicle.title}</Typography>
                  <Typography color="text.secondary">{vehicle.subtitle}</Typography>
                </Box>
              ))}
              <Button component={RouterLink} to={appRoutes.vehicles} variant="outlined" startIcon={<DirectionsCarRoundedIcon />}>Открыть автомобили</Button>
            </Stack>
          ) : (
            <EmptyState title="Автомобили пока не добавлены" description="После первой привязки машины здесь появится быстрый доступ к истории заказов и статусам обслуживания." icon={<DirectionsCarRoundedIcon />} />
          )}
        </SectionCard>

        <SectionCard title="Бонусы и выгода" description="Лояльность показана как понятная клиентская польза, а не как бухгалтерский модуль.">
          {data.loyalty ? (
            <Stack spacing={1.5}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>{data.loyalty.balanceLabel}</Typography>
                <Typography color="text.secondary">{data.loyalty.tierLabel}</Typography>
              </Box>
              <Typography color="text.secondary">{data.loyalty.orderBenefitLabel}</Typography>
              <Button component={RouterLink} to={appRoutes.loyalty} variant="outlined" startIcon={<LoyaltyRoundedIcon />}>Открыть лояльность</Button>
            </Stack>
          ) : (
            <EmptyState title="Бонусы пока недоступны" description="Как только программа лояльности подключится к клиентскому кабинету, баланс и выгода появятся здесь." icon={<LoyaltyRoundedIcon />} />
          )}
        </SectionCard>
        <SectionCard title="Центр событий" description="Клиент видит только полезные сигналы: что требует внимания сейчас, о чём стоит помнить и куда логично перейти дальше.">
          <Stack spacing={1.5}>
            {data.notificationsPreview.map((item) => (
              <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1}>
                  <Typography fontWeight={700}>{item.title}</Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                  {item.actionLabel && item.actionTo ? (
                    <Button component={RouterLink} to={item.actionTo} variant="outlined" startIcon={<NotificationsActiveRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                      {item.actionLabel}
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            ))}
            {data.reminders.map((item) => (
              <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography fontWeight={700}>{item.title}</Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Box>
            ))}
            <Button component={RouterLink} to={appRoutes.notifications} variant="text" startIcon={<NotificationsActiveRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>Открыть все уведомления</Button>
          </Stack>
        </SectionCard>
      </Box>

      <SectionCard title="Быстрые действия" description="MVP dashboard должен давать короткие и очевидные входы в основные клиентские сценарии.">
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))'
            }
          }}
        >
          <Button component={RouterLink} to={appRoutes.orders} variant="contained" startIcon={<ReceiptLongRoundedIcon />} sx={{ justifyContent: 'flex-start' }}>
            Открыть мои заказы
          </Button>
          <Button component={RouterLink} to={appRoutes.approvals} variant="outlined" startIcon={<TaskAltRoundedIcon />} sx={{ justifyContent: 'flex-start' }}>
            Проверить согласования
          </Button>
          <Button component={RouterLink} to={appRoutes.vehicles} variant="outlined" startIcon={<DirectionsCarRoundedIcon />} sx={{ justifyContent: 'flex-start' }}>
            Открыть мои автомобили
          </Button>
          <Button component={RouterLink} to={appRoutes.booking} variant="outlined" startIcon={<EventAvailableRoundedIcon />} sx={{ justifyContent: 'flex-start' }}>
            Записаться в сервис
          </Button>
          <Button component={RouterLink} to={appRoutes.notifications} variant="outlined" startIcon={<NotificationsActiveRoundedIcon />} sx={{ justifyContent: 'flex-start' }}>
            Центр событий
          </Button>
        </Box>
      </SectionCard>
    </Stack>
  );
};
