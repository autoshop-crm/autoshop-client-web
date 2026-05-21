import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Alert, Box, Button, Chip, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useApprovalDetailsData } from '../../hooks/useApprovalDetailsData';

const LoadingState = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" height={56} />
    <Skeleton variant="rounded" height={240} />
    <Skeleton variant="rounded" height={260} />
  </Stack>
);

export const ApprovalDecisionPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ approvalId: string }>();
  const approvalId = params.approvalId ? Number(params.approvalId) : undefined;
  const { loading, saving, error, successMessage, data, reload, approve, reject } = useApprovalDetailsData(approvalId);
  const [comment, setComment] = useState('');

  const isResolved = useMemo(() => !data?.isOpen, [data]);

  if (loading) return <LoadingState />;
  if (error && !data) return <AppAlert message={error} onRetry={() => void reload()} />;
  if (!data) {
    return <EmptyState title="Согласование не найдено" description="Похоже, это решение уже недоступно или ссылка устарела." actionLabel="Назад к списку" onAction={() => navigate(appRoutes.approvals)} />;
  }

  return (
    <Stack spacing={3} sx={{ pb: { xs: 14, md: 0 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(appRoutes.approvals)}>
          Назад
        </Button>
        <PageIntro title={data.title} description={data.summary} />
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

      <SectionCard
        title="Решение по дополнительным работам"
        description="На этом экране должно быть сразу понятно, что нашли, зачем рекомендуем и как это изменит стоимость."
        action={<Chip icon={<WarningAmberRoundedIcon />} label={data.totalAmountLabel} color="warning" />}
      >
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: 'warning.light' }}>
            <Typography fontWeight={800} color="warning.dark" variant="h5">{data.totalAmountLabel}</Typography>
            <Typography color="warning.dark">Изменение итоговой стоимости по заказу</Typography>
          </Box>

          <Stack spacing={1.25}>
            <Typography fontWeight={700}>Что нашли</Typography>
            <Typography color="text.secondary">{data.summary}</Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Typography fontWeight={700}>Сколько это стоит</Typography>
            <Typography>Работы: {data.laborAmountLabel}</Typography>
            <Typography>Детали: {data.partsAmountLabel}</Typography>
            <Typography fontWeight={700}>Итого изменение: {data.totalAmountLabel}</Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Typography fontWeight={700}>Что будет дальше</Typography>
            <Typography color="text.secondary">{data.decisionHint}</Typography>
            <Typography color="text.secondary">После подтверждения сервис продолжит работы по согласованному объёму. Если отклонить, команда остановит именно этот дополнительный объём.</Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Typography fontWeight={700}>Комментарий</Typography>
            <TextField
              multiline
              minRows={4}
              placeholder="Если нужно, оставьте комментарий для сервиса"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={saving || isResolved}
            />
          </Stack>
        </Stack>
      </SectionCard>

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
        <SectionCard title="Кратко по решению" description="Второй блок дублирует суть решения коротко, чтобы не заставлять клиента перечитывать всё снова.">
          <Stack spacing={1.25}>
            <Typography>Запрос создан: {data.requestedAtLabel}</Typography>
            {data.expiresAtLabel ? <Typography>Действует до: {data.expiresAtLabel}</Typography> : null}
            <Typography>Общий итог: {data.totalAmountLabel}</Typography>
          </Stack>
        </SectionCard>

        <SectionCard title="Связанный заказ" description="Согласование не существует отдельно от заказа — клиент всегда может вернуться к контексту ремонта.">
          <Button component={RouterLink} to={appRoutes.orderDetails(data.orderId)} variant="outlined" startIcon={<ReceiptLongRoundedIcon />}>
            Открыть заказ #{data.orderId}
          </Button>
        </SectionCard>
      </Box>

      <Box
        sx={{
          position: { xs: 'fixed', md: 'static' },
          insetInline: { xs: 0, md: 'auto' },
          bottom: { xs: 76, md: 'auto' },
          zIndex: 1100,
          px: { xs: 2, md: 0 },
          pb: { xs: 1.5, md: 0 }
        }}
      >
        <Box sx={{ bgcolor: { xs: 'background.paper', md: 'transparent' }, borderRadius: { xs: 4, md: 0 }, boxShadow: { xs: 8, md: 'none' }, p: { xs: 1.5, md: 0 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              startIcon={<TaskAltRoundedIcon />}
              disabled={saving || isResolved}
              onClick={() => void approve(comment)}
              sx={{ minWidth: { md: 220 } }}
            >
              {saving ? 'Сохраняем…' : isResolved ? 'Решение уже принято' : 'Подтвердить работы'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={saving || isResolved}
              onClick={() => void reject(comment)}
              sx={{ minWidth: { md: 220 } }}
            >
              Отклонить
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};
