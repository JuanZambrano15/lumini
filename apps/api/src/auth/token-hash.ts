import { createHash, randomBytes } from 'node:crypto';

/** Genera un refresh token opaco (no es un JWT) con 384 bits de entropía. */
export function generateOpaqueToken(): string {
  return randomBytes(48).toString('base64url');
}

/**
 * Los refresh tokens se guardan hasheados con SHA-256: son aleatorios y largos,
 * así que no necesitan un hash lento como argon2 y se pueden buscar por igualdad.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
