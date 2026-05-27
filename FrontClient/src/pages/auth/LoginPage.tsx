import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Alert, Box, Button, Card, CardContent, Link, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { appRoutes } from '../../app/router/routeMap';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState(import.meta.env.VITE_ENABLE_AUTH_MOCK === 'true' ? 'client@autoshop.local' : '');
  const [password, setPassword] = useState(import.meta.env.VITE_ENABLE_AUTH_MOCK === 'true' ? 'Client123!' : '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? appRoutes.home;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось войти. Проверьте логин и пароль.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 1080, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' } }}>
          <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack spacing={3}>
              <Typography variant="h3" color="common.white">AutoShop Client</Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.92)">Быстрый клиентский кабинет без лишнего шума: статус, цена, документы и действия в одном месте.</Typography>
              <Stack spacing={1.5}>
                <Typography color="rgba(255,255,255,0.88)">- До нужной информации не больше 3 кликов</Typography>
                <Typography color="rgba(255,255,255,0.88)">- Только важные блоки по машине и заказам</Typography>
                <Typography color="rgba(255,255,255,0.88)">- Понятный кабинет для всех основных действий</Typography>
              </Stack>
            </Stack>
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <Typography variant="h4">Вход в кабинет</Typography>
                <Typography color="text.secondary">Введите email и пароль, чтобы открыть личный кабинет.</Typography>
              </Stack>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField label="Email" value={username} onChange={(event) => setUsername(event.target.value)} fullWidth autoComplete="username" />
              <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth autoComplete="current-password" />
              <Button type="submit" size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} disabled={submitting}>
                {submitting ? 'Входим…' : 'Войти'}
              </Button>
              <Stack direction="row" justifyContent="space-between" spacing={2} flexWrap="wrap">
                <Link component={RouterLink} to={appRoutes.register} underline="hover">Регистрация</Link>
                <Link component={RouterLink} to={appRoutes.recovery} underline="hover">Восстановить доступ</Link>
              </Stack>
              {import.meta.env.VITE_ENABLE_AUTH_MOCK === 'true' ? (
                <Alert severity="info">Mock auth включён через `VITE_ENABLE_AUTH_MOCK=true`.</Alert>
              ) : null}
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};
