import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';
import { useLoyaltyData } from '../../hooks/useLoyaltyData';

export const LoyaltyPage = () => {
  const { loading, error, data, reload } = useLoyaltyData();

  if (loading) {
    return <AppLoader />;
  }

  if (error || !data) {
    return <AppAlert message={error ?? 'Попробуйте обновить страницу ещё раз.'} onRetry={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Loyalty benefit"
        title="Бонусы и выгода"
        description="Лояльность здесь показана как понятная клиентская польза: сколько бонусов доступно сейчас, где они уже помогли сэкономить и как это связано с вашими заказами."
      />

      <Alert severity="info">Без бухгалтерии: только баланс, реальная выгода и понятная связь с заказами.</Alert>

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.1fr 0.9fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Текущий баланс" description="Клиенту нужно сразу увидеть доступную выгоду и общий смысл программы без сложных правил.">
            <Stack spacing={2}>
              <Box sx={{ p: 2.75, borderRadius: 3, bgcolor: 'background.default' }}>
                <Typography variant="h5" fontWeight={800}>{data.overview.balanceLabel}</Typography>
                <Typography color="text.secondary">Уровень: {data.overview.tierLabel}</Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
                <Chip label={data.overview.earnedLabel} color="success" />
                <Chip label={data.overview.spentLabel} color="default" variant="outlined" />
              </Stack>
              <Typography color="text.secondary">{data.explanation}</Typography>
            </Stack>
          </SectionCard>

          <SectionCard title="Где бонусы уже помогают" description="Выгода должна быть привязана к конкретному заказу, чтобы клиент видел не абстрактные баллы, а реальное влияние на стоимость.">
            {data.impactCards.length > 0 ? (
              <Stack spacing={1.5}>
                {data.impactCards.map((item) => (
                  <Box key={item.orderId} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1.25}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography fontWeight={800}>{item.title}</Typography>
                        <Chip icon={<TrendingUpRoundedIcon />} label={item.benefitLabel} color="success" />
                      </Stack>
                      <Typography color="text.secondary">{item.summary}</Typography>
                      <Typography variant="body2" color="text.secondary">Итог по заказу: {item.totalLabel}</Typography>
                      <Button component={RouterLink} to={item.to} variant="text" startIcon={<ReceiptLongRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                        Открыть заказ
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Пока нет использованных бонусов" description="Когда бонусы повлияют на стоимость заказа, это сразу появится в этом блоке." icon={<LoyaltyRoundedIcon />} />
            )}
          </SectionCard>
        </Stack>

        <Stack spacing={3}>
          <SectionCard title="Текущая выгода" description="Один короткий card-block должен объяснять клиенту, зачем программа полезна прямо сейчас.">
            <Box sx={{ p: 2.75, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography fontWeight={800}>{data.currentBenefitLabel}</Typography>
              <Typography color="text.secondary">{data.overview.orderBenefitLabel}</Typography>
            </Box>
          </SectionCard>

          <SectionCard title="История начислений и списаний" description="История нужна как прозрачность, а не как бухгалтерский журнал: коротко, понятно и с привязкой к заказу, если она есть.">
            {data.ledger.length > 0 ? (
              <Stack spacing={1.5}>
                {data.ledger.map((item) => (
                  <Box key={item.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography fontWeight={700}>{item.title}</Typography>
                        <Chip label={item.pointsLabel} color={item.tone === 'success' ? 'success' : 'warning'} />
                      </Stack>
                      <Typography color="text.secondary">{item.description}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.createdAtLabel}</Typography>
                      {item.orderId && item.orderCtaLabel ? (
                        <Button component={RouterLink} to={appRoutes.orderDetails(item.orderId)} variant="text" sx={{ alignSelf: 'flex-start' }}>
                          {item.orderCtaLabel}
                        </Button>
                      ) : null}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="История пока пуста" description="Когда бонусы начнут начисляться или списываться, здесь появится прозрачная история изменений." icon={<TrendingUpRoundedIcon />} />
            )}
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
