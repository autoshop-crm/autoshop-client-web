import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';

export const RecoveryPlaceholderPage = () => (
  <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto', py: 6 }}>
    <PageIntro
      title="Восстановление доступа пока не подключено"
      description="В текущем backend contract для `FrontClient` нет подтверждённого public recovery/reset-password API."
    />
    <Alert severity="info" icon={<InfoOutlinedIcon />}>
      Это не ошибка фронта: для recovery нужен отдельный backend/auth endpoint. Пока корректный путь — использовать уже выданные учётные данные.
    </Alert>
    <SectionCard title="Следующий шаг" description="Как только backend откроет recovery contract, этот экран можно будет перевести с placeholder на реальный flow.">
      <Button component={RouterLink} to={appRoutes.login} variant="contained">Назад ко входу</Button>
    </SectionCard>
  </Stack>
);
