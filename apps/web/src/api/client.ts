import { storage } from '@/lib/storage';
import type { AuthTokens } from './types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
const TOKENS_KEY = 'lumini.tokens';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Estado de sesión a nivel de módulo: lo comparten todas las peticiones.
let tokens: AuthTokens | null = storage.get<AuthTokens>(TOKENS_KEY);
let parentToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;
let onParentExpired: (() => void) | null = null;

export const session = {
  hasTokens: () => tokens !== null,
  setTokens(next: AuthTokens | null) {
    tokens = next;
    if (next) storage.set(TOKENS_KEY, next);
    else storage.remove(TOKENS_KEY);
  },
  refreshToken: () => tokens?.refreshToken ?? null,
  /** El token de modo padres solo vive en memoria: al recargar se pide el PIN de nuevo. */
  setParentToken(token: string | null) {
    parentToken = token;
  },
  onExpired(listener: (() => void) | null) {
    onSessionExpired = listener;
  },
  onParentExpired(listener: (() => void) | null) {
    onParentExpired = listener;
  },
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Envía el token de modo padres (rutas protegidas por PIN). */
  parent?: boolean;
  /** Rutas de autenticación: no se adjunta token ni se intenta refrescar. */
  anonymous?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);

  if (response.status === 401 && !options.anonymous && tokens) {
    if (await refreshTokens()) return parse<T>(await send(path, options));
    session.setTokens(null);
    onSessionExpired?.();
  }

  // El token de padres expiró: se vuelve a pedir el PIN.
  if (response.status === 403 && options.parent) onParentExpired?.();

  return parse<T>(response);
}

function send(path: string, { method = 'GET', body, parent, anonymous }: RequestOptions) {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!anonymous && tokens) headers.Authorization = `Bearer ${tokens.accessToken}`;
  if (parent && parentToken) headers['X-Parent-Token'] = parentToken;

  return fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, extractMessage(data) ?? 'Algo salió mal, intenta de nuevo');
  }
  return data as T;
}

function extractMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object' || !('message' in data)) return null;
  const { message } = data as { message: unknown };
  if (Array.isArray(message)) return message.join('. ');
  return typeof message === 'string' ? message : null;
}

/**
 * Refresca el access token una sola vez aunque varias peticiones fallen a la vez:
 * todas esperan la misma promesa.
 */
function refreshTokens(): Promise<boolean> {
  if (!refreshInFlight) {
    const refreshToken = tokens?.refreshToken;
    refreshInFlight = (async () => {
      if (!refreshToken) return false;
      try {
        const next = await parse<AuthTokens>(
          await send('/auth/refresh', {
            method: 'POST',
            body: { refreshToken },
            anonymous: true,
          }),
        );
        session.setTokens(next);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}
