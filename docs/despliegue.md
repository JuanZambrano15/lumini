# Despliegue

Toda la app está contenerizada, así que se puede desplegar en cualquier proveedor que ejecute contenedores Docker.

## Imágenes

| Imagen | Dockerfile            | Contenido                                                                      |
| ------ | --------------------- | ------------------------------------------------------------------------------ |
| API    | `apps/api/Dockerfile` | Node 22 Alpine, usuario sin privilegios; al arrancar aplica migraciones y seed |
| Web    | `apps/web/Dockerfile` | Build estático servido por nginx, que además hace proxy de `/api`              |

Ambas se construyen desde la raíz del repositorio: `docker build -f apps/api/Dockerfile .`. La CI las construye en cada PR.

## Opción 1: un servidor con Docker Compose (VPS)

Ideal para la entrega: un servidor pequeño (DigitalOcean, Hetzner, AWS Lightsail…) con Docker.

```sh
git clone https://github.com/JuanZambrano15/lumini && cd lumini
cp .env.example .env   # cambia TODAS las claves por valores aleatorios
docker compose up -d --build
```

Pon delante un proxy con HTTPS (Caddy o Traefik) apuntando al puerto 8080.

## Opción 2: plataforma administrada (Railway o Render)

1. Crea una base de datos PostgreSQL administrada.
2. Crea un servicio con `apps/api/Dockerfile` y estas variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_PARENT_SECRET`, `CORS_ORIGINS` y, opcionalmente, `GEMINI_API_KEY`. Health check: `/api/health`.
3. Crea un servicio con `apps/web/Dockerfile` y la variable `API_UPSTREAM` apuntando a la URL interna de la API.

## Variables de producción obligatorias

- `JWT_ACCESS_SECRET` y `JWT_PARENT_SECRET`: mínimo 32 caracteres aleatorios y distintos entre sí (`openssl rand -base64 48`).
- `POSTGRES_PASSWORD` o `DATABASE_URL` con una clave fuerte.
- `CORS_ORIGINS`: el dominio público, más `capacitor://localhost,https://localhost` si se publica el APK.
- `TRUST_PROXY_HOPS`: número de proxies delante de la API (1 con nginx; 2 si además hay un balanceador del proveedor).

## APK de Android

```sh
cd apps/web
echo "VITE_API_URL=https://tu-dominio.com/api" > .env.production.local
pnpm exec cap add android   # solo la primera vez
pnpm cap:sync
pnpm cap:open               # Android Studio → Build → Build APK(s)
```

Requiere Android Studio y JDK 21. La carpeta `android/` generada no se versiona.
