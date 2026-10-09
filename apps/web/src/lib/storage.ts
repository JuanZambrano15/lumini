/**
 * Envoltura de localStorage que nunca lanza: en modo privado o con el
 * almacenamiento bloqueado simplemente se comporta como vacío.
 * Funciona igual en el navegador y en el WebView de Capacitor.
 */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Sin almacenamiento disponible: la sesión durará solo mientras la pestaña esté abierta.
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignorado a propósito (ver arriba).
    }
  },
};
