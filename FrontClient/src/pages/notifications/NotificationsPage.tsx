import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useNotificationsData } from '../../hooks/useNotificationsData';

export const NotificationsPage = () => {
  const { loading, error, data, reload } = useNotificationsData();

  if (loading) return <AppLoader />;
  if (error || !data) return <AppAlert message={error ?? 'Попробуйте обновить страницу ещё раз.'} onRetry={() => void reload()} />;

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Service maturity"
        title="Уведомления и полезные поводы"
        description="Здесь собраны только полезные клиентские сигналы: что требует внимания сейчас, о чём стоит вспомнить и какие сервисные действия помогут не выпадать из цикла обслуживания."
      />

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.1fr 0.9fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Что требует внимания" description="Приоритетные события остаются короткими и action-first: открыть, подтвердить, проверить.">
            {data.notifications.length > 0 ? (
              <Stack spacing={1.5}>
                {data.notifications.map((item) => (
                  <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography fontWeight={800}>{item.title}</Typography>
                        <Chip label={item.createdAtLabel} color={item.tone === 'warning' ? 'warning' : item.tone === 'success' ? 'success' : 'primary'} />
                      </Stack>
                      <Typography color="text.secondary">{item.description}</Typography>
                      {item.actionLabel && item.actionTo ? <Button component={RouterLink} to={item.actionTo} variant="text" sx={{ alignSelf: 'flex-start' }}>{item.actionLabel}</Button> : null}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Срочных уведомлений нет" description="Как только сервису понадобится ваше внимание, событие появится здесь в одном коротком блоке." icon={<NotificationsActiveRoundedIcon />} />
            )}
          </SectionCard>

          <SectionCard title="Напоминания" description="Напоминания помогают не пропустить визит и не возвращаться к сервисным вопросам в последний момент.">
            {data.reminders.length > 0 ? (
              <Stack spacing={1.5}>
                {data.reminders.map((item) => (
                  <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography color="text.secondary">{item.description}</Typography>
                      <Button component={RouterLink} to={item.actionTo} variant="outlined" startIcon={<TodayRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>{item.actionLabel}</Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Напоминаний пока нет" description="Когда появится ближайший визит или важный срок, он будет показан здесь коротко и понятно." icon={<TodayRoundedIcon />} />
            )}
          </SectionCard>
        </Stack>

        <Stack spacing={3}>
          <SectionCard title="Полезные рекомендации" description="Рекомендации не должны быть навязчивыми: только понятные поводы вернуться к обслуживанию или открыть нужный раздел.">
            {data.recommendations.length > 0 ? (
              <Stack spacing={1.5}>
                {data.recommendations.map((item) => (
                  <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{item.title}</Typography>
                      <Typography color="text.secondary">{item.description}</Typography>
                      <Button component={RouterLink} to={item.actionTo} variant="contained" startIcon={<TipsAndUpdatesRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>{item.actionLabel}</Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Рекомендаций пока нет" description="Когда появится сезонный повод или логичный repeat-visit CTA, он появится здесь без лишнего маркетингового шума." icon={<TipsAndUpdatesRoundedIcon />} />
            )}
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
