import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';

const navItems = [
  { label: 'Главная', value: appRoutes.home, icon: <HomeRoundedIcon /> },
  { label: 'Заказы', value: appRoutes.orders, icon: <ReceiptLongRoundedIcon /> },
  { label: 'Авто', value: appRoutes.vehicles, icon: <DirectionsCarRoundedIcon /> },
  { label: 'Согласования', value: appRoutes.approvals, icon: <TaskAltRoundedIcon /> },
  { label: 'Профиль', value: appRoutes.profile, icon: <PersonRoundedIcon /> }
];

export const ClientBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedValue = navItems.find((item) => location.pathname === item.value || location.pathname.startsWith(`${item.value}/`))?.value ?? appRoutes.home;

  return (
    <Paper sx={{ position: 'fixed', insetInline: 0, bottom: 0, display: { xs: 'block', md: 'none' }, zIndex: 1200 }} elevation={8}>
      <BottomNavigation showLabels value={selectedValue} onChange={(_, value) => navigate(value)}>
        {navItems.map((item) => (
          <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
