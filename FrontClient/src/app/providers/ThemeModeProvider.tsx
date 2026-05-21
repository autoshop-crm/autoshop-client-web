import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { authStorage } from '../../auth/storage';
import { ThemeMode } from '../../styles/theme';

interface ThemeModeContextValue {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const ThemeModeProvider = ({ children }: PropsWithChildren) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(authStorage.getThemeMode() ?? 'light');

  const value = useMemo(
    () => ({
      themeMode,
      toggleThemeMode: () => {
        setThemeMode((currentMode) => {
          const nextMode = currentMode === 'light' ? 'dark' : 'light';
          authStorage.setThemeMode(nextMode);
          return nextMode;
        });
      }
    }),
    [themeMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }

  return context;
};
