import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../api/authApi';
import { authStorage } from '../../auth/storage';
import { AuthUser, LoginPayload, RegisterPayload } from '../../types/auth';

interface AuthContextValue {
  booting: boolean;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ requiresEmailVerification: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authStorage.getUser());
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = authStorage.getToken();

      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const user = await authApi.me(token);
        authStorage.setUser(user);
        setCurrentUser(user);
      } catch {
        authStorage.clear();
        setCurrentUser(null);
      } finally {
        setBooting(false);
      }
    };

    void bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    authStorage.setToken(response.accessToken);
    authStorage.setRefreshToken(response.refreshToken);

    const user = await authApi.me(response.accessToken);
    authStorage.setUser(user);
    setCurrentUser(user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authApi.register(payload);
    authStorage.setToken(response.accessToken);
    authStorage.setRefreshToken(response.refreshToken);

    const user = await authApi.me(response.accessToken).catch(() => authApi.normalizeSessionUser(response));
    authStorage.setUser(user);
    setCurrentUser(user);

    return { requiresEmailVerification: response.requiresEmailVerification };
  }, []);

  const logout = useCallback(async () => {
    const accessToken = authStorage.getToken();
    const refreshToken = authStorage.getRefreshToken();

    try {
      if (accessToken && refreshToken) {
        await authApi.logout(accessToken, refreshToken);
      }
    } finally {
      authStorage.clear();
      setCurrentUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      booting,
      currentUser,
      isAuthenticated: Boolean(currentUser && authStorage.getToken()),
      login,
      register,
      logout
    }),
    [booting, currentUser, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
