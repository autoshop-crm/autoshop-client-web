import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Alert, Box, Button, Card, CardContent, Checkbox, FormControlLabel, Link, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { appRoutes } from '../../app/router/routeMap';

export const RegisterPlaceholderPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        acceptTerms,
        acceptPrivacyPolicy
      });

      setSuccessMessage(
        result.requiresEmailVerification
          ? 'Аккаунт создан. Подтвердите email, если backend требует verification, но кабинет уже готов к использованию.'
          : 'Аккаунт создан. Перенаправляем в кабинет.'
      );
      navigate(appRoutes.home, { replace: true });
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? 'Не удалось зарегистрироваться. Проверьте данные и попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(
    firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phoneNumber.trim() &&
      password.length >= 8 &&
      acceptTerms &&
      acceptPrivacyPolicy
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 1120, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' } }}>
          <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack spacing={3}>
              <Typography variant="h3" color="common.white">AutoShop Client</Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.92)">Создайте клиентский кабинет и управляйте обслуживанием без звонков: запись, статус заказа, согласования и документы в одном месте.</Typography>
              <Stack spacing={1.5}>
                <Typography color="rgba(255,255,255,0.88)">- Регистрация напрямую через новый customer auth facade</Typography>
                <Typography color="rgba(255,255,255,0.88)">- Один UI-язык для web и mobile</Typography>
                <Typography color="rgba(255,255,255,0.88)">- Сразу после регистрации можно перейти в кабинет</Typography>
              </Stack>
            </Stack>
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <Typography variant="h4">Регистрация</Typography>
                <Typography color="text.secondary">Создайте customer account через backend endpoint `POST /api/auth/customers/register`.</Typography>
              </Stack>
              {error ? <Alert severity="error">{error}</Alert> : null}
              {successMessage ? <Alert severity="success" icon={<CheckCircleOutlineRoundedIcon />}>{successMessage}</Alert> : null}
              <TextField label="Имя" value={firstName} onChange={(event) => setFirstName(event.target.value)} fullWidth />
              <TextField label="Фамилия" value={lastName} onChange={(event) => setLastName(event.target.value)} fullWidth />
              <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth autoComplete="email" />
              <TextField label="Телефон" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} fullWidth autoComplete="tel" />
              <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} fullWidth autoComplete="new-password" helperText="Минимум 8 символов." />
              <FormControlLabel control={<Checkbox checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} />} label="Принимаю условия использования" />
              <FormControlLabel control={<Checkbox checked={acceptPrivacyPolicy} onChange={(event) => setAcceptPrivacyPolicy(event.target.checked)} />} label="Принимаю политику конфиденциальности" />
              <Button type="submit" size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} disabled={submitting || !canSubmit}>
                {submitting ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
              </Button>
              <Stack direction="row" justifyContent="space-between" spacing={2} flexWrap="wrap">
                <Link component={RouterLink} to={appRoutes.login} underline="hover">Уже есть аккаунт</Link>
                <Link component={RouterLink} to={appRoutes.recovery} underline="hover">Восстановить доступ</Link>
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};
