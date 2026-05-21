import { Stack, Typography } from '@mui/material';

export const PageIntro = ({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) => (
  <Stack spacing={1}>
    {eyebrow ? (
      <Typography variant="body2" color="primary.main" fontWeight={700}>
        {eyebrow}
      </Typography>
    ) : null}
    <Typography variant="h4">{title}</Typography>
    <Typography color="text.secondary" maxWidth={720}>
      {description}
    </Typography>
  </Stack>
);
