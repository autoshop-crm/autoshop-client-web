import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '../../app/router/routeMap';

const navItems = [
  { label: 'Главная', to: appRoutes.home, icon: <HomeRoundedIcon /> },
  { label: 'Мои заказы', to: appRoutes.orders, icon: <ReceiptLongRoundedIcon /> },
  { label: 'Мои автомобили', to: appRoutes.vehicles, icon: <DirectionsCarRoundedIcon /> },
  { label: 'Согласования', to: appRoutes.approvals, icon: <TaskAltRoundedIcon /> },
  { label: 'Документы', to: appRoutes.documents, icon: <DescriptionRoundedIcon /> },
  { label: 'Лояльность', to: appRoutes.loyalty, icon: <LoyaltyRoundedIcon /> },
  { label: 'Профиль', to: appRoutes.profile, icon: <PersonRoundedIcon /> }
];

export const ClientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Paper sx={{ width: 280, p: 2.5, display: { xs: 'none', md: 'block' }, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6">AutoShop Client</Typography>
          <Typography color="text.secondary">Личный сервисный кабинет</Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {navItems.map((item) => {
            const active = item.to === appRoutes.home ? location.pathname === item.to : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

            return (
              <ListItemButton key={item.to} selected={active} onClick={() => navigate(item.to)} sx={{ borderRadius: 3, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Stack>
    </Paper>
  );
};
