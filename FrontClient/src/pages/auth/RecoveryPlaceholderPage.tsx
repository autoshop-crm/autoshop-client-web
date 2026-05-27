import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageIntro } from '../../components/PageIntro';
import { SectionCard } from '../../components/SectionCard';
import { appRoutes } from '../../app/router/routeMap';

export const RecoveryPlaceholderPage = () => (
  <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto', py: 6 }}>
    <PageIntro
      title="Восстановление доступа пока недоступно"
      description="Сейчас восстановить доступ через этот экран нельзя."
    />
    <Alert severity="info" icon={<InfoOutlinedIcon />}>
      Если не получается войти, попробуйте использовать текущие данные для входа или обратитесь в сервис.
    </Alert>
    <SectionCard title="Что можно сделать" description="Вернитесь на экран входа и попробуйте авторизоваться ещё раз.">
      <Button component={RouterLink} to={appRoutes.login} variant="contained">Назад ко входу</Button>
    </SectionCard>
  </Stack>
);
