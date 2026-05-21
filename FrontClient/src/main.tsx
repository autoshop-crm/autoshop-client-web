import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { AuthProvider } from './app/providers/AuthProvider';
import { ThemeModeProvider, useThemeMode } from './app/providers/ThemeModeProvider';
import { createAppTheme } from './styles/theme';
import './styles/global.css';

const RootApp = () => {
  const { themeMode } = useThemeMode();
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <RootApp />
    </ThemeModeProvider>
  </React.StrictMode>
);
