import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PriceCheckRoundedIcon from '@mui/icons-material/PriceCheckRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { DocumentGroupsCard } from '../../components/DocumentGroupsCard';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';
import { useDocumentActions } from '../../hooks/useDocumentActions';
import { useOrderDetailsData } from '../../hooks/useOrderDetailsData';

export const OrderDetailsPage = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId ? Number(params.orderId) : undefined;
  const { loading, error, data, reload } = useOrderDetailsData(orderId);
  const actions = useDocumentActions(reload);

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

  if (loading) {
    return <AppLoader />;
  }

  if (error || !data) {
    return <AppAlert message={error ?? 'Попробуйте обновить страницу ещё раз.'} onRetry={() => void reload()} />;
  }

  return (
    <Stack spacing={3}>
      <PageIntro eyebrow="Order details" title={data.order.title} description={`${data.order.problemSummary}. Клиент видит только статус, стоимость, согласования и материалы по заказу.`} />

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.3fr 0.7fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Статус и следующий шаг" description="Клиент должен быстро понять, что происходит с заказом и требуется ли от него действие.">
            <Stack spacing={1.5}>
              <Chip label={data.order.statusLabel} color={data.order.isAttentionRequired ? 'warning' : 'primary'} sx={{ alignSelf: 'flex-start' }} />
              <Typography>{data.order.statusDescription}</Typography>
              <Typography color="text.secondary">{data.order.nextAction}</Typography>
              <Typography variant="body2" color="text.secondary">Запланировано: {data.order.scheduledAt}</Typography>
            </Stack>
          </SectionCard>

          <SectionCard title="Стоимость" description="Цена заказа должна читаться как клиентская выгода и понятный итог, без внутренней операционной детализации.">
            <Stack spacing={1.25}>
              <Typography>Работы: {data.order.priceSummary.laborLabel}</Typography>
              <Typography>Запчасти: {data.order.priceSummary.partsLabel}</Typography>
              <Typography fontWeight={800}>Итого: {data.order.priceSummary.totalLabel}</Typography>
              {data.order.priceSummary.discountLabel ? <Typography color="success.main">{data.order.priceSummary.discountLabel}</Typography> : null}
              {data.order.priceSummary.pointsLabel ? <Typography color="success.main">{data.order.priceSummary.pointsLabel}</Typography> : null}
              {data.order.priceSummary.highlightDelta ? <Chip icon={<PriceCheckRoundedIcon />} label={data.order.priceSummary.highlightDelta} color="warning" sx={{ alignSelf: 'flex-start' }} /> : null}
            </Stack>
          </SectionCard>

          <SectionCard title="Лента заказа" description="Показываем только ключевые обновления, чтобы клиент видел реальный прогресс без перегруза экранов.">
            {data.timeline.length > 0 ? (
              <Stack spacing={1.5}>
                {data.timeline.map((event) => (
                  <Box key={event.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Typography fontWeight={700}>{event.title}</Typography>
                    <Typography color="text.secondary">{event.description}</Typography>
                    <Typography variant="body2" color="text.secondary">{event.occurredAtLabel}</Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Обновлений пока нет" description="Когда сервис добавит новые этапы, они сразу появятся в ленте заказа." icon={<HistoryRoundedIcon />} />
            )}
          </SectionCard>

          <DocumentGroupsCard
            title="Фото и документы по заказу"
            description="Trust layer для клиента: фото осмотра, сметы, документы и акты можно открыть и скачать без лишних терминов и лишних шагов."
            groups={data.documentGroups}
            emptyTitle="Материалы по заказу пока не добавлены"
            emptyDescription="Когда сервис загрузит фото, смету или акт, они появятся в этом блоке."
            onOpen={handleOpen}
            onDownload={handleDownload}
            busyFileId={actions.busyFileId}
          />
        </Stack>

        <Stack spacing={3}>
          {data.vehicle ? (
            <SectionCard title="Автомобиль" description="Заказ всегда связан с машиной, поэтому клиенту нужен быстрый переход к карточке автомобиля.">
              <Stack spacing={1.5}>
                <Typography fontWeight={700}>{data.vehicle.title}</Typography>
                <Typography color="text.secondary">{data.vehicle.subtitle}</Typography>
                <Typography variant="body2" color="text.secondary">{data.vehicle.licensePlate}</Typography>
                <Button component={RouterLink} to={appRoutes.vehicleDetails(data.vehicle.id)} variant="outlined" startIcon={<DirectionsCarRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                  Открыть авто
                </Button>
              </Stack>
            </SectionCard>
          ) : null}

          <SectionCard title="Согласования" description="Если по заказу есть новые работы или изменения стоимости, клиент должен видеть это отдельно и быстро.">
            {data.approvals.length > 0 ? (
              <Stack spacing={1.5}>
                {data.approvals.map((approval) => (
                  <Box key={approval.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>{approval.title}</Typography>
                      <Typography color="text.secondary">{approval.summary}</Typography>
                      <Chip label={approval.totalAmountLabel} color={approval.isOpen ? 'warning' : 'default'} sx={{ alignSelf: 'flex-start' }} />
                      <Button component={RouterLink} to={appRoutes.approvalDetails(approval.id)} variant="text" startIcon={<TaskAltRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                        Открыть согласование
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Согласований нет" description="Если появятся новые работы или изменения стоимости, они отобразятся в этом блоке." icon={<TaskAltRoundedIcon />} />
            )}
          </SectionCard>

          <Alert severity="info">Через customer self-service API здесь уже доступны чтение и скачивание документов. Загрузка файлов для клиента будет подключена после появления backend upload facade.</Alert>
        </Stack>
      </Box>
    </Stack>
  );
};
