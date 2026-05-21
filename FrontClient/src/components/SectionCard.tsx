import { Card, CardContent, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionCard = ({ title, description, action, children }: SectionCardProps) => (
  <Card>
    <CardContent sx={{ p: { xs: 2.75, sm: 3 }, '&:last-child': { pb: { xs: 2.75, sm: 3 } } }}>
      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5} sx={{ minWidth: 0, pl: 0.25 }}>
            <Typography variant="h6">{title}</Typography>
            {description ? <Typography color="text.secondary">{description}</Typography> : null}
          </Stack>
          {action}
        </Stack>
        {children}
      </Stack>
    </CardContent>
  </Card>
);
