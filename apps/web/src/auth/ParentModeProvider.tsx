import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { session } from '@/api/client';
import { ParentModeContext } from './contexts';

/**
 * Zona de padres: se desbloquea con el PIN y se vuelve a bloquear sola cuando
 * expira el token (o al recargar, porque solo vive en memoria).
 */
export function ParentModeProvider({ children }: { children: ReactNode }) {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const lock = useCallback(() => {
    session.setParentToken(null);
    setExpiresAt(null);
  }, []);

  const unlock = useCallback((token: string, expiresInSeconds: number) => {
    session.setParentToken(token);
    setExpiresAt(Date.now() + expiresInSeconds * 1000);
  }, []);

  useEffect(() => {
    session.onParentExpired(lock);
    return () => session.onParentExpired(null);
  }, [lock]);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setTimeout(lock, expiresAt - Date.now());
    return () => window.clearTimeout(timer);
  }, [expiresAt, lock]);

  const value = useMemo(
    () => ({ isUnlocked: expiresAt !== null, unlock, lock }),
    [expiresAt, unlock, lock],
  );
  return <ParentModeContext.Provider value={value}>{children}</ParentModeContext.Provider>;
}
