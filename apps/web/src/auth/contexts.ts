import { createContext } from 'react';
import type { User } from '@/api/types';

// Los contextos viven aquí (separados de sus providers) para que Fast Refresh
// pueda recargar los componentes sin perder el estado.

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface ActiveChildContextValue {
  activeChildId: string | null;
  selectChild: (id: string | null) => void;
}

export const ActiveChildContext = createContext<ActiveChildContextValue | null>(null);

export interface ParentModeContextValue {
  isUnlocked: boolean;
  unlock: (token: string, expiresInSeconds: number) => void;
  lock: () => void;
}

export const ParentModeContext = createContext<ParentModeContextValue | null>(null);
