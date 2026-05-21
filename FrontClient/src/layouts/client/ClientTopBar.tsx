import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { useThemeMode } from '../../app/providers/ThemeModeProvider';
import { appRoutes } from '../../app/router/routeMap';
import { ThemeModeSwitch } from '../../components/ThemeModeSwitch';

export const ClientTopBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useThemeMode();

  const handleLogout = async () => {
    await logout();
    navigate(appRoutes.login, { replace: true });
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{currentUser?.firstName?.[0] ?? 'C'}</Avatar>
          <Box>
            <Typography fontWeight={700}>Здравствуйте, {currentUser?.firstName ?? 'клиент'}</Typography>
            <Typography variant="body2" color="text.secondary">Все важное по обслуживанию — в одном месте</Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Chip label="Client" color="primary" variant="outlined" />
          <ThemeModeSwitch mode={themeMode} onToggle={toggleThemeMode} />
          <Button variant="outlined" color="inherit" startIcon={<LogoutRoundedIcon />} onClick={() => void handleLogout()} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Выйти
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
