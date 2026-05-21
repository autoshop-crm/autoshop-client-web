import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Alert, Button, Stack } from '@mui/material';

export const AppAlert = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <Stack spacing={2}>
    <Alert severity="error">{message}</Alert>
    {onRetry ? (
      <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={onRetry} sx={{ alignSelf: 'flex-start' }}>
        Повторить
      </Button>
    ) : null}
  </Stack>
);
