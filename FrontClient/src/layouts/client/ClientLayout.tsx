import { Box, Container, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ClientBottomNav } from './ClientBottomNav';
import { ClientSidebar } from './ClientSidebar';
import { ClientTopBar } from './ClientTopBar';

export const ClientLayout = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, md: 3 } }}>
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <ClientTopBar />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          <ClientSidebar />
          <Box sx={{ flex: 1, width: '100%' }}>
            <Outlet />
          </Box>
        </Stack>
      </Stack>
    </Container>
    <ClientBottomNav />
  </Box>
);
