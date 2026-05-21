import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PhotoRoundedIcon from '@mui/icons-material/PhotoRounded';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { ClientDocumentGroupViewModel } from '../domain/client/view-models';
import { EmptyState } from './EmptyState';
import { SectionCard } from './SectionCard';

interface DocumentGroupsCardProps {
  title: string;
  description: string;
  groups: ClientDocumentGroupViewModel[];
  emptyTitle: string;
  emptyDescription: string;
  onOpen: (fileId: string) => Promise<void> | void;
  onDownload: (fileId: string) => Promise<void> | void;
  busyFileId?: string | null;
}

export const DocumentGroupsCard = ({
  title,
  description,
  groups,
  emptyTitle,
  emptyDescription,
  onOpen,
  onDownload,
  busyFileId = null
}: DocumentGroupsCardProps) => (
  <SectionCard title={title} description={description}>
    {groups.length > 0 ? (
      <Stack spacing={2}>
        {groups.map((group) => (
          <Stack key={group.key} spacing={1.5}>
            <Box>
              <Typography fontWeight={700}>{group.title}</Typography>
              <Typography variant="body2" color="text.secondary">{group.description}</Typography>
            </Box>
            <Stack spacing={1.5}>
              {group.items.map((document) => (
                <Box key={document.id} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                      <Chip icon={document.isImage ? <PhotoRoundedIcon /> : <DescriptionRoundedIcon />} label={document.categoryLabel} size="small" />
                      <Chip label={document.sizeLabel} size="small" variant="outlined" />
                    </Stack>
                    <Box>
                      <Typography fontWeight={700}>{document.title}</Typography>
                      <Typography color="text.secondary">{document.subtitle}</Typography>
                      <Typography variant="body2" color="text.secondary">{document.previewHint}</Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
                      <Button variant="contained" startIcon={<OpenInNewRoundedIcon />} onClick={() => void onOpen(document.id)} disabled={Boolean(busyFileId) && busyFileId === document.id}>
                        {document.openLabel}
                      </Button>
                      <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={() => void onDownload(document.id)} disabled={Boolean(busyFileId) && busyFileId === document.id}>
                        {document.downloadLabel}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    ) : (
      <EmptyState title={emptyTitle} description={emptyDescription} icon={<DescriptionRoundedIcon />} />
    )}
  </SectionCard>
);
