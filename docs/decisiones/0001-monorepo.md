# 0001. Monorepo con API y web separadas

- **Estado**: aceptada
- **Fecha**: 2026-10

## Contexto

La primera versión era una app Next.js donde toda la lógica corría en el navegador contra Firebase, sin backend propio. No había APIs, la lógica se repetía en cada página y no se podía proteger nada del lado del servidor.

## Decisión

Separar el sistema en `apps/api` (backend) y `apps/web` (frontend) dentro de un mismo repositorio con pnpm workspaces.

## Consecuencias

- La lógica de negocio y la seguridad viven en un solo lugar: la API.
- La web y el APK consumen la misma API.
- Un solo repositorio, una sola CI y PRs que cambian API y web juntos.
- A cambio, se mantienen dos aplicaciones y la configuración de pnpm workspaces.
