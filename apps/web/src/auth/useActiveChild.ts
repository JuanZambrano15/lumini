import { useContext } from 'react';
import { useChild } from '@/api/hooks';
import { ActiveChildContext } from './contexts';

export function useActiveChild() {
  const context = useContext(ActiveChildContext);
  if (!context) throw new Error('useActiveChild debe usarse dentro de <ActiveChildProvider>');
  return context;
}

/** Perfil activo con sus datos. Solo usar dentro de rutas protegidas por <RequireChild>. */
export function useCurrentChild() {
  const { activeChildId } = useActiveChild();
  const query = useChild(activeChildId);
  if (!activeChildId) throw new Error('No hay un perfil activo');
  return { childId: activeChildId, ...query };
}
