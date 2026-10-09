import { ApiError } from '@/api/client';

/** Mensaje legible para mostrar al usuario a partir de cualquier error. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return 'No hay conexión con el servidor';
  return 'Algo salió mal, intenta de nuevo';
}
