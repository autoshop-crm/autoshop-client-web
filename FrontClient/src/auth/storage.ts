import { AuthUser } from '../types/auth';

const ACCESS_TOKEN_KEY = 'frontclient.accessToken';
const REFRESH_TOKEN_KEY = 'frontclient.refreshToken';
const USER_KEY = 'frontclient.currentUser';
const THEME_MODE_KEY = 'frontclient.themeMode';

export const authStorage = {
  getToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  setUser: (user: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getThemeMode: () => localStorage.getItem(THEME_MODE_KEY) as 'light' | 'dark' | null,
  setThemeMode: (themeMode: 'light' | 'dark') => localStorage.setItem(THEME_MODE_KEY, themeMode),
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
