import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useCallback, useEffect, useMemo } from 'react';
import { api, session } from '@/api/client';
import { queryKeys } from '@/api/hooks';
import type { AuthResult, User } from '@/api/types';
import { AuthContext, type AuthContextValue } from './contexts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => api<User>('/me'),
    enabled: session.hasTokens(),
    retry: false,
    staleTime: Infinity,
  });

  const clearSession = useCallback(() => {
    session.setTokens(null);
    session.setParentToken(null);
    queryClient.clear();
  }, [queryClient]);

  // Si el refresh token expira en cualquier petición, se cierra la sesión en toda la app.
  useEffect(() => {
    session.onExpired(clearSession);
    return () => session.onExpired(null);
  }, [clearSession]);

  const startSession = useCallback(
    async (result: AuthResult) => {
      session.setTokens(result);
      await queryClient.fetchQuery({ queryKey: queryKeys.me, queryFn: () => api<User>('/me') });
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: session.hasTokens() && isLoading,
      login: async (email, password) =>
        startSession(
          await api<AuthResult>('/auth/login', {
            method: 'POST',
            body: { email, password },
            anonymous: true,
          }),
        ),
      register: async (email, password, name) =>
        startSession(
          await api<AuthResult>('/auth/register', {
            method: 'POST',
            body: { email, password, name: name || undefined },
            anonymous: true,
          }),
        ),
      logout: async () => {
        const refreshToken = session.refreshToken();
        clearSession();
        if (refreshToken) {
          await api('/auth/logout', {
            method: 'POST',
            body: { refreshToken },
            anonymous: true,
          }).catch(() => undefined);
        }
      },
    }),
    [user, isLoading, startSession, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
