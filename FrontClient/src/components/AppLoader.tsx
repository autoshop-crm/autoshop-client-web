import { CircularProgress, Stack, Typography } from '@mui/material';

export const AppLoader = ({ message = 'Загружаем кабинет…' }: { message?: string }) => (
  <Stack minHeight="100vh" alignItems="center" justifyContent="center" spacing={2.5}>
    <CircularProgress />
    <Typography color="text.secondary">{message}</Typography>
  </Stack>
);
