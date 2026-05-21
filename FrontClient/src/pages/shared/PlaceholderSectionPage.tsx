import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';

interface PlaceholderSectionPageProps {
  title: string;
  description: string;
  nextStep: string;
  actionLabel?: string;
  actionTo?: string;
}

export const PlaceholderSectionPage = ({ title, description, nextStep, actionLabel, actionTo }: PlaceholderSectionPageProps) => (
  <Stack spacing={3}>
    <PageIntro title={title} description={description} />
    <SectionCard title="Phase 1 status" description="Shell, providers и identity уже подключены; детальная бизнес-логика придёт в следующих фазах.">
      <Stack spacing={2}>
        <Typography color="text.secondary">{nextStep}</Typography>
        {actionLabel && actionTo ? (
          <Button component={RouterLink} to={actionTo} variant="contained" endIcon={<ArrowForwardRoundedIcon />}>{actionLabel}</Button>
        ) : null}
      </Stack>
    </SectionCard>
  </Stack>
);
