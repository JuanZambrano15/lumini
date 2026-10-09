import { useContext } from 'react';
import { ParentModeContext } from './contexts';

export function useParentMode() {
  const context = useContext(ParentModeContext);
  if (!context) throw new Error('useParentMode debe usarse dentro de <ParentModeProvider>');
  return context;
}
