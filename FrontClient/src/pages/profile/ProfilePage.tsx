import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Alert, Box, Button, Chip, Stack, Switch, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { AppAlert } from '../../components/AppAlert';
import { AppLoader } from '../../components/AppLoader';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { useAuth } from '../../app/providers/AuthProvider';
import { profileApi } from '../../api/profileApi';
import { useProfileData } from '../../hooks/useProfileData';

export const ProfilePage = () => {
  const { loading, error, data, reload } = useProfileData();
  const { logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [savingContacts, setSavingContacts] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!data) {
      return;
    }
    const parts = data.fullName.split(' ');
    setFirstName(parts[0] ?? '');
    setLastName(parts.slice(1).join(' '));
    setEmail(data.email);
    setPhone(data.phone === 'Телефон не указан' ? '' : data.phone);
    setNotificationSettings(Object.fromEntries(data.notificationSettings.map((item) => [item.key, item.enabled])));
  }, [data]);

  const notificationsDirty = useMemo(
    () => data ? data.notificationSettings.some((item) => notificationSettings[item.key] !== item.enabled) : false,
    [data, notificationSettings]
  );

  if (loading) {
    return <AppLoader />;
  }

  if (error || !data) {
    return <AppAlert message={error ?? 'Попробуйте обновить страницу ещё раз.'} onRetry={() => void reload()} />;
  }

  const saveContacts = async () => {
    setSavingContacts(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await profileApi.updateContacts({ firstName, lastName, email, phone });
      await reload();
      setActionMessage('Контакты сохранены.');
    } catch (requestError: any) {
      setActionError(requestError?.response?.data?.message ?? 'Не удалось сохранить контакты.');
    } finally {
      setSavingContacts(false);
    }
  };

  const savePassword = async () => {
    setSavingPassword(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await profileApi.updatePassword({ currentPassword, nextPassword });
      setCurrentPassword('');
      setNextPassword('');
      setActionMessage('Пароль обновлён.');
    } catch {
      setActionError('Backend пока не предоставил customer-safe password API для этого экрана.');
    } finally {
      setSavingPassword(false);
    }
  };

  const saveNotifications = async () => {
    setSavingNotifications(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await profileApi.updateNotifications({
        orderUpdates: Boolean(notificationSettings.orderUpdates),
        approvals: Boolean(notificationSettings.approvals),
        reminders: Boolean(notificationSettings.reminders),
        promotions: Boolean(notificationSettings.promotions)
      });
      await reload();
      setActionMessage('Настройки уведомлений сохранены.');
    } catch {
      setActionError('Backend пока не предоставил API для сохранения notification settings.');
    } finally {
      setSavingNotifications(false);
    }
  };

  return (
    <Stack spacing={3}>
      <PageIntro
        eyebrow="Profile settings"
        title="Профиль и настройки"
        description="Здесь вы управляете только своими контактами, каналами связи, паролем и уведомлениями — без staff-шумa и без лишних системных деталей."
      />

      {actionMessage ? <Alert severity="success">{actionMessage}</Alert> : null}
      {actionError ? <Alert severity="error">{actionError}</Alert> : null}

      <Box sx={{ display: 'grid', gap: 24, gridTemplateColumns: { xs: '1fr', xl: '1.15fr 0.85fr' } }}>
        <Stack spacing={3}>
          <SectionCard title="Профиль клиента" description={data.profileHint}>
            <Stack spacing={2}>
              <TextField label="Имя" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              <TextField label="Фамилия" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              <TextField label="Email" value={email} InputProps={{ readOnly: true }} helperText="Email управляется через auth flow и здесь не редактируется." />
              <TextField label="Телефон" value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Button variant="contained" startIcon={<SaveRoundedIcon />} disabled={savingContacts} onClick={() => void saveContacts()} sx={{ alignSelf: 'flex-start' }}>
                {savingContacts ? 'Сохраняем…' : 'Сохранить контакты'}
              </Button>
            </Stack>
          </SectionCard>

          <SectionCard title="Смена пароля" description={data.passwordHint}>
            <Stack spacing={2}>
              <TextField label="Текущий пароль" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
              <TextField label="Новый пароль" type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} helperText="Минимум 8 символов." />
              <Button variant="outlined" startIcon={<PasswordRoundedIcon />} disabled={savingPassword || !currentPassword || !nextPassword} onClick={() => void savePassword()} sx={{ alignSelf: 'flex-start' }}>
                {savingPassword ? 'Обновляем…' : 'Обновить пароль'}
              </Button>
            </Stack>
          </SectionCard>
        </Stack>

        <Stack spacing={3}>
          <SectionCard title="Подтверждённые каналы" description="Показываем только те каналы, по которым сервис реально может связаться с вами по заказу или записи.">
            <Stack spacing={1.5}>
              {data.channels.map((channel) => (
                <Box key={`${channel.typeLabel}-${channel.value}`} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Stack spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Typography fontWeight={700}>{channel.typeLabel}</Typography>
                      <Chip icon={<VerifiedRoundedIcon />} label={channel.statusLabel} color={channel.tone === 'success' ? 'success' : 'warning'} />
                    </Stack>
                    <Typography color="text.secondary">{channel.value}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </SectionCard>

          <SectionCard title="Уведомления" description="Уведомления остаются сервисными и полезными: заказы, согласования и напоминания о визите.">
            <Stack spacing={1.5}>
              {data.notificationSettings.map((setting) => (
                <Box key={setting.key} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                  <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight={700}>{setting.title}</Typography>
                      <Typography color="text.secondary">{setting.description}</Typography>
                    </Box>
                    <Switch checked={Boolean(notificationSettings[setting.key])} onChange={(event) => setNotificationSettings((prev) => ({ ...prev, [setting.key]: event.target.checked }))} />
                  </Stack>
                </Box>
              ))}
              <Button variant="contained" startIcon={<SaveRoundedIcon />} disabled={savingNotifications || !notificationsDirty} onClick={() => void saveNotifications()} sx={{ alignSelf: 'flex-start' }}>
                {savingNotifications ? 'Сохраняем…' : 'Сохранить уведомления'}
              </Button>
            </Stack>
          </SectionCard>

          <SectionCard title="Аккаунт" description="Если нужно завершить сессию на этом устройстве, это действие должно быть простым и ожидаемым.">
            <Button variant="outlined" color="inherit" startIcon={<ExitToAppRoundedIcon />} onClick={() => void logout()} sx={{ alignSelf: 'flex-start' }}>
              Выйти из аккаунта
            </Button>
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
