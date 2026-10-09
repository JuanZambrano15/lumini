import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Empaquetado como APK: Capacitor envuelve el build estático (dist/) en una app Android.
 * Antes de `pnpm cap:sync`, compila con VITE_API_URL apuntando a la API desplegada.
 */
const config: CapacitorConfig = {
  appId: 'co.lumini.app',
  appName: 'Lumini',
  webDir: 'dist',
  android: {
    // Permite probar contra una API local por http durante el desarrollo.
    allowMixedContent: true,
  },
};

export default config;
