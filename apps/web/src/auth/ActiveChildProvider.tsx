import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { storage } from '@/lib/storage';
import { ActiveChildContext } from './contexts';

const ACTIVE_CHILD_KEY = 'lumini.activeChildId';

/**
 * Guarda solo el id del perfil elegido. Los datos del niño (estrellas, avatar)
 * siempre se leen de la API para no mostrar información desactualizada.
 */
export function ActiveChildProvider({ children }: { children: ReactNode }) {
  const [activeChildId, setActiveChildId] = useState(() => storage.get<string>(ACTIVE_CHILD_KEY));

  const selectChild = useCallback((id: string | null) => {
    setActiveChildId(id);
    if (id) storage.set(ACTIVE_CHILD_KEY, id);
    else storage.remove(ACTIVE_CHILD_KEY);
  }, []);

  const value = useMemo(() => ({ activeChildId, selectChild }), [activeChildId, selectChild]);
  return <ActiveChildContext.Provider value={value}>{children}</ActiveChildContext.Provider>;
}
