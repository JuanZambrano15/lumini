# 0004. React + Vite + Capacitor para web y APK

- **Estado**: aceptada
- **Fecha**: 2026-10

## Contexto

La app debe funcionar como página web y poder empaquetarse como APK de Android.

## Decisión

Una SPA con React 19 y Vite, empaquetada como APK con Capacitor.

## Alternativas consideradas

- **Seguir con Next.js**: sus ventajas (SSR, rutas del servidor) no se aprovechan en una app detrás de un login, y Capacitor necesita un build estático, que en Next tiene limitaciones (rutas dinámicas, middleware).
- **React Native / Expo**: app nativa real, pero obligaría a mantener dos interfaces (web y móvil).

## Consecuencias

- Un solo código para web, PWA y APK.
- La SEO de la landing es limitada (SPA). Si en el futuro importa, la landing puede separarse como sitio estático.
