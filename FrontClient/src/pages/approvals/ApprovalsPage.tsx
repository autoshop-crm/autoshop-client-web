import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';
import { AppAlert } from '../../components/AppAlert';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useApprovalsData } from '../../hooks/useApprovalsData';

const LoadingState = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" height={96} />
    <Skeleton variant="rounded" height={240} />
    <Skeleton variant="rounded" height={240} />
  </Stack>
);

export const ApprovalsPage = () => {
  const { loading, error, openApprovals, historyApprovals, reload } = useApprovalsData();

  if (loading) return <LoadingState />;
  if (error) return <AppAlert message={error} onRetry={() => void reload()} />;

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Approvals MVP"
        title="Согласования"
        description="Это один из самых важных экранов клиентского кабинета: здесь решения по дополнительным работам должны приниматься быстро, понятно и без лишнего шума."
      />

      <SectionCard title="Ждут вашего решения" description="Открытые согласования поднимаются выше истории, потому что именно здесь клиент принимает денежное решение.">
        {openApprovals.length > 0 ? (
          <Stack spacing={1.5}>
            {openApprovals.map((approval) => (
              <Box key={approval.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1.25}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{approval.title}</Typography>
                    <Chip icon={<WarningAmberRoundedIcon />} label={approval.totalAmountLabel} color="warning" />
                  </Stack>
                  <Typography color="text.secondary">{approval.summary}</Typography>
                  <Typography variant="body2">Запрос создан {approval.requestedAtLabel}</Typography>
                  <Typography fontWeight={700}>Что делать: {approval.decisionHint}</Typography>
                  <Button component={RouterLink} to={appRoutes.approvalDetails(approval.id)} variant="contained" startIcon={<TaskAltRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                    Открыть согласование
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="Открытых согласований нет" description="Если сервису понадобится ваше решение по дополнительным работам, запрос сразу появится здесь." icon={<TaskAltRoundedIcon />} />
        )}
      </SectionCard>

      <SectionCard title="История решений" description="Прошлые решения остаются доступными, но не отвлекают от активных финансовых действий.">
        {historyApprovals.length > 0 ? (
          <Stack spacing={1.5}>
            {historyApprovals.map((approval) => (
              <Box key={approval.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                <Stack spacing={1}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={700}>{approval.title}</Typography>
                    <Chip label={approval.isOpen ? 'Открыто' : approval.decisionHint} color={approval.tone === 'success' ? 'success' : approval.tone === 'error' ? 'error' : 'default'} />
                  </Stack>
                  <Typography color="text.secondary">{approval.summary}</Typography>
                  <Typography variant="body2">{approval.totalAmountLabel} · {approval.requestedAtLabel}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="История пока пуста" description="После первых решений по допработам история согласований появится в этом блоке." icon={<HistoryRoundedIcon />} />
        )}
      </SectionCard>
    </Stack>
  );
};
