# syntax=docker/dockerfile:1
# Imagen de producción del frontend (SPA servida por nginx).
#   docker build -f apps/web/Dockerfile .

FROM node:22-alpine AS build
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @lumini/web
COPY apps/web apps/web
# Por defecto la web llama a /api en su mismo dominio y nginx lo redirige a la API.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @lumini/web build

FROM nginx:1.27-alpine AS runtime
# nginx sustituye las variables de entorno de los *.template al arrancar.
ENV API_UPSTREAM=http://api:3000
COPY apps/web/docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
