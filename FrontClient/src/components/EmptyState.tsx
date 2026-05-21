import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { Button, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => (
  <Stack spacing={2} alignItems="flex-start">
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 52,
        height: 52,
        borderRadius: '16px',
        bgcolor: 'primary.light',
        color: 'primary.main'
      }}
    >
      {icon ?? <InboxRoundedIcon />}
    </Stack>
    <Stack spacing={0.5}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
    {actionLabel && onAction ? (
      <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
    ) : null}
  </Stack>
);
