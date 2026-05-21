import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { Box, IconButton } from '@mui/material';
import { ThemeMode } from '../styles/theme';

interface ThemeModeSwitchProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export const ThemeModeSwitch = ({ mode, onToggle }: ThemeModeSwitchProps) => {
  const isLight = mode === 'light';

  return (
    <IconButton
      onClick={onToggle}
      aria-label={isLight ? 'Включить тёмную тему' : 'Включить светлую тему'}
      sx={{
        p: 0,
        width: 68,
        height: 38,
        borderRadius: 999,
        bgcolor: isLight ? '#DBEAFE' : '#0F172A',
        border: `1px solid ${isLight ? '#BFDBFE' : '#334155'}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease, transform 200ms ease',
        boxShadow: isLight ? 'inset 0 1px 2px rgba(37, 99, 235, 0.12)' : 'inset 0 1px 2px rgba(15, 23, 42, 0.5)',
        '&:hover': {
          bgcolor: isLight ? '#BFDBFE' : '#132033'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.1,
          color: isLight ? '#2563EB' : '#F8FAFC'
        }}
      >
        <DarkModeRoundedIcon sx={{ fontSize: 17, opacity: isLight ? 0.45 : 0.95, transform: `scale(${isLight ? 0.9 : 1})`, transition: 'all 240ms ease' }} />
        <LightModeRoundedIcon sx={{ fontSize: 17, opacity: isLight ? 0.95 : 0.45, transform: `scale(${isLight ? 1 : 0.9})`, transition: 'all 240ms ease' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 30,
          height: 30,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: isLight ? '#F59E0B' : '#E2E8F0',
          bgcolor: isLight ? '#FFFFFF' : '#1E293B',
          transform: `translateX(${isLight ? '32px' : '0'})`,
          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), background-color 260ms ease, color 260ms ease, box-shadow 260ms ease',
          boxShadow: isLight
            ? '0 4px 14px rgba(245, 158, 11, 0.28)'
            : '0 4px 14px rgba(15, 23, 42, 0.42)'
        }}
      >
        {isLight ? (
          <LightModeRoundedIcon sx={{ fontSize: 18, transition: 'transform 260ms ease', transform: 'rotate(0deg)' }} />
        ) : (
          <DarkModeRoundedIcon sx={{ fontSize: 18, transition: 'transform 260ms ease', transform: 'rotate(-12deg)' }} />
        )}
      </Box>
    </IconButton>
  );
};
