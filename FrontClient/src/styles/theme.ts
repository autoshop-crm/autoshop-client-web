import { createTheme } from '@mui/material';

export type ThemeMode = 'light' | 'dark';

const appFontFamily = ['Inter', 'system-ui', 'sans-serif'].join(',');

export const createAppTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        dark: '#1D4ED8',
        light: '#DBEAFE'
      },
      secondary: {
        main: '#0F172A'
      },
      success: {
        main: '#059669'
      },
      warning: {
        main: '#D97706'
      },
      background:
        mode === 'light'
          ? {
              default: '#F8FAFC',
              paper: '#FFFFFF'
            }
          : {
              default: '#020617',
              paper: '#0F172A'
            },
      text:
        mode === 'light'
          ? {
              primary: '#0F172A',
              secondary: '#64748B'
            }
          : {
              primary: '#F8FAFC',
              secondary: '#94A3B8'
            },
      divider: mode === 'light' ? '#E2E8F0' : '#1E293B'
    },
    shape: {
      borderRadius: 14
    },
    typography: {
      fontFamily: appFontFamily,
      h3: {
        fontWeight: 800,
        letterSpacing: '-0.03em'
      },
      h4: {
        fontWeight: 800,
        letterSpacing: '-0.02em'
      },
      h5: {
        fontWeight: 700
      },
      button: {
        fontFamily: appFontFamily,
        fontWeight: 700,
        textTransform: 'none'
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none'
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            minHeight: 44,
            paddingInline: 16
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            maxWidth: '100%'
          },
          label: {
            paddingLeft: 10,
            paddingRight: 10
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow:
              mode === 'light'
                ? '0 8px 30px rgba(15, 23, 42, 0.06)'
                : '0 18px 40px rgba(2, 6, 23, 0.40)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 18
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12
          }
        }
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 76,
            borderTop: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1E293B'}`
          }
        }
      }
    }
  });
