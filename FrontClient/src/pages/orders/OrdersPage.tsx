import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useOrdersData } from '../../hooks/useOrdersData';

const OrdersLoadingState = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" height={96} />
    <Skeleton variant="rounded" height={220} />
    <Skeleton variant="rounded" height={320} />
  </Stack>
);

export const OrdersPage = () => {
  const { loading, error, data, reload } = useOrdersData();

  if (loading) {
    return <OrdersLoadingState />;
  }

  if (error) {
    return <AppAlert message={error} onRetry={() => void reload()} />;
  }

  if (!data) {
    return <EmptyState title="Заказы недоступны" description="Список заказов появится, как только данные будут готовы." actionLabel="Повторить" onAction={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Orders MVP"
        title="Мои заказы"
        description="Здесь собраны только клиентски важные заказы: активные отдельно, архив отдельно, а заказы с нужным действием поднимаются наверх."
      />

      <SectionCard title="Требуют вашего внимания" description="Сначала показываем заказы, где нужен ответ клиента или скоро будет решение по деньгам.">
        {data.actionRequiredOrders.length > 0 ? (
          <Stack spacing={1.5}>
            {data.actionRequiredOrders.map((order) => (
              <Box key={order.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1.25}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{order.title}</Typography>
                    <Chip icon={<WarningAmberRoundedIcon />} label={order.statusLabel} color="warning" />
                  </Stack>
                  <Typography color="text.secondary">{order.vehicleSummary}</Typography>
                  <Typography>{order.nextAction}</Typography>
                  <Button component={RouterLink} to={appRoutes.orderDetails(order.id)} variant="contained" startIcon={<TaskAltRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                    Открыть заказ
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="Срочных действий нет" description="Если потребуется согласование или подтверждение, заказ сразу появится в этом блоке." icon={<TaskAltRoundedIcon />} />
        )}
      </SectionCard>

      <SectionCard title="Активные заказы" description="Активные заказы собраны в card-first списке, без тяжёлых таблиц и без служебных деталей.">
        {data.activeOrders.length > 0 ? (
          <Stack spacing={1.5}>
            {data.activeOrders.map((order) => (
              <Box key={order.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1.25}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{order.title}</Typography>
                    <Chip label={order.statusLabel} color={order.isAttentionRequired ? 'warning' : 'primary'} />
                  </Stack>
                  <Typography color="text.secondary">{order.vehicleSummary}</Typography>
                  <Typography color="text.secondary">Визит: {order.scheduledAt}</Typography>
                  <Typography>{order.problemSummary}</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
                    <Chip label={`Итог ${order.priceSummary.totalLabel}`} variant="outlined" color="success" />
                    <Chip label={order.approvalState.primaryLabel} variant="outlined" color={order.approvalState.hasPendingApprovals ? 'warning' : 'success'} />
                    <Chip label={order.documentsSummary.primaryLabel} variant="outlined" />
                  </Stack>
                  <Button component={RouterLink} to={appRoutes.orderDetails(order.id)} variant="outlined" startIcon={<ReceiptLongRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                    Открыть детали
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="Активных заказов нет" description="Когда появится новая запись или сервис возьмёт машину в работу, заказ появится здесь." icon={<ReceiptLongRoundedIcon />} />
        )}
      </SectionCard>

      <SectionCard title="Архив заказов" description="История остаётся доступной, но не отвлекает от текущих действий. Архив вынесен в отдельный блок.">
        {data.archivedOrders.length > 0 ? (
          <Stack spacing={1.5}>
            {data.archivedOrders.map((order) => (
              <Box key={order.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{order.title}</Typography>
                    <Chip label={order.statusLabel} color={order.tone === 'success' ? 'success' : order.tone === 'error' ? 'error' : 'default'} />
                  </Stack>
                  <Typography color="text.secondary">{order.vehicleSummary}</Typography>
                  <Typography color="text.secondary">Итог {order.priceSummary.totalLabel}</Typography>
                  <Button component={RouterLink} to={appRoutes.orderDetails(order.id)} variant="text" sx={{ alignSelf: 'flex-start' }}>
                    Посмотреть историю
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="Архив пока пуст" description="После завершения первых заказов здесь появится история обслуживания по автомобилям." />
        )}
      </SectionCard>
    </Stack>
  );
};
