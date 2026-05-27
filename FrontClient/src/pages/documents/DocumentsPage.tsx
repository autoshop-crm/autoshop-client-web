import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { DocumentGroupsCard } from '../../components/DocumentGroupsCard';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useDocumentActions } from '../../hooks/useDocumentActions';
import { useDocumentsData } from '../../hooks/useDocumentsData';

export const DocumentsPage = () => {
  const { loading, error, data, reload } = useDocumentsData();
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

  const primarySection = data.sections[0] ?? null;

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Документы"
        title="Документы и фото"
        description="Здесь собраны фото, документы, акты и сметы по вашим автомобилям и заказам."
      />

      <Alert severity="info">Документы и фото можно открыть или скачать в пару нажатий.</Alert>

      {primarySection ? (
        <DocumentGroupsCard
          title={`Сейчас важнее всего · ${primarySection.title}`}
          description={`${primarySection.ownerLabel}. Быстрый доступ к материалам, которые помогают понять текущее состояние и стоимость.`}
          groups={primarySection.groups}
          emptyTitle="Материалы пока не добавлены"
          emptyDescription="Когда сервис загрузит фото, смету или акт, они появятся здесь без лишних таблиц."
          onOpen={handleOpen}
          onDownload={handleDownload}
          busyFileId={actions.busyFileId}
        />
      ) : (
        <EmptyState title="Документы пока не появились" description="Когда по заказам или автомобилям добавятся фото и документы, они появятся в этом разделе." icon={<FolderRoundedIcon />} />
      )}

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.2fr 0.8fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Материалы по заказам и авто" description="Каждый блок показывает только понятный клиенту контекст: к чему относится материал и куда перейти дальше.">
            {data.sections.length > 0 ? (
              <Stack spacing={2}>
                {data.sections.map((section) => (
                  <Box key={section.id} sx={{ p: 2.75, borderRadius: 3, bgcolor: 'background.default' }}>
                    <Stack spacing={1.5}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Box>
                          <Typography fontWeight={800}>{section.title}</Typography>
                          <Typography color="text.secondary">{section.subtitle}</Typography>
                        </Box>
                        <Chip label={`${section.totalCount} файлов`} color="primary" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">{section.ownerLabel}</Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {section.groups.map((group) => <Chip key={group.key} label={`${group.title} · ${group.items.length}`} size="small" />)}
                      </Stack>
                      <Button component={RouterLink} to={section.to} variant="text" startIcon={<ReceiptLongRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
                        {section.actionLabel}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState title="Пока нет доступных материалов" description="После первых загрузок по заказам и автомобилям здесь появятся понятные группы файлов." />
            )}
          </SectionCard>
        </Stack>

        <Alert severity="info">Сейчас в этом разделе доступны просмотр и скачивание файлов.</Alert>
      </Box>
    </Stack>
  );
};
