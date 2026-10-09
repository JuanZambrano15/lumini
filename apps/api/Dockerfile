# syntax=docker/dockerfile:1
# Imagen de producción de la API. Se construye desde la raíz del monorepo:
#   docker build -f apps/api/Dockerfile .

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /repo

# ── Build: instala dependencias, compila y empaqueta solo lo necesario ──────
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @lumini/api
COPY apps/api apps/api
# `prisma generate` no se conecta a la base, pero prisma.config.ts exige la variable.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build pnpm --filter @lumini/api build \
 && pnpm --filter @lumini/api deploy --prod --legacy /out

# ── Runtime: imagen mínima, sin código fuente ni dependencias de desarrollo ─
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1
# Aplica migraciones y el seed (idempotente) antes de arrancar.
CMD ["npm", "run", "start:prod"]
