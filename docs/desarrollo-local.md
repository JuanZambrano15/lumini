# Desarrollo local

Hay dos formas de correr Lumini en tu máquina. Para **ver la app funcionando** usa la opción A; para **programar** con recarga en caliente usa la opción B.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose).
- Para la opción B, además: Node.js 22 y pnpm 10 (`corepack enable` los activa).

## Opción A: todo con Docker (un comando)

```sh
cp .env.example .env
docker compose up --build
```

| Qué                     | Dónde                                                      |
| ----------------------- | ---------------------------------------------------------- |
| La app                  | http://localhost:8080                                      |
| Documentación de la API | http://localhost:8080/api/docs                             |
| PostgreSQL              | `localhost:5432` (usuario y base `lumini`, clave `lumini`) |

Para apagarlo: `Ctrl+C` o `docker compose down`. Los datos quedan guardados en un volumen de Docker; para borrarlos y empezar de cero: `docker compose down -v`.

## Opción B: modo desarrollo (recarga en caliente)

```sh
pnpm install                              # dependencias de todo el monorepo
cp .env.example .env                      # variables de docker compose
docker compose up -d db                   # solo la base de datos
cp apps/api/.env.example apps/api/.env    # variables de la API
pnpm --filter @lumini/api db:deploy       # crea las tablas
pnpm --filter @lumini/api db:seed         # carga avatares, temas, juegos y la tienda
pnpm dev                                  # API en :3000 y web en :5173
```

Abre http://localhost:5173. Cada vez que guardas un archivo, la web y la API se recargan solas.

## Ver la base de datos

La forma más cómoda es **Prisma Studio**, una interfaz web para ver y editar las tablas:

```sh
pnpm --filter @lumini/api db:studio   # abre http://localhost:5555
```

También puedes conectarte con cualquier cliente de PostgreSQL (DBeaver, TablePlus, pgAdmin, la extensión de VS Code) usando `postgresql://lumini:lumini@localhost:5432/lumini`.

## Activar a Lumi (la IA) en local

Es opcional. Sin clave, la pestaña "Pregúntale a Lumi" muestra que Lumi está descansando y el resto de la app funciona igual.

1. Crea una clave gratis en [Google AI Studio](https://aistudio.google.com/apikey).
2. Ponla en `GEMINI_API_KEY` de `apps/api/.env` (opción B) o de `.env` (opción A).
3. Reinicia la API y, en la Zona de padres, activa "Permitir preguntas a Lumi" para el perfil.

## Comandos útiles

| Comando                                      | Para qué                                          |
| -------------------------------------------- | ------------------------------------------------- |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Revisar el código antes de un commit              |
| `pnpm --filter @lumini/api test:e2e`         | Test de punta a punta (necesita la base de datos) |
| `pnpm --filter @lumini/api db:migrate`       | Crear una migración tras cambiar `schema.prisma`  |
| `docker compose logs -f api`                 | Ver los logs de la API en Docker                  |

## Problemas comunes

- **`P1001: Can't reach database server`**: la base de datos no está corriendo. Ejecuta `docker compose up -d db`.
- **El puerto 5432 está ocupado**: tienes otro PostgreSQL instalado. Apágalo o cambia el puerto en `docker-compose.yml` y en `DATABASE_URL`.
- **Cambié el esquema y la app falla**: corre `pnpm --filter @lumini/api db:deploy` y reinicia la API.
