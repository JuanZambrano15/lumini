# API

La documentación completa e interactiva (Swagger) está en `/api/docs` cuando la API está corriendo. Aquí va el panorama general.

## Autenticación

| Token           | Cómo se obtiene                       | Duración | Dónde viaja                    |
| --------------- | ------------------------------------- | -------- | ------------------------------ |
| Access token    | `POST /auth/login` o `/auth/register` | 15 min   | `Authorization: Bearer …`      |
| Refresh token   | Igual que el anterior                 | 7 días   | Cuerpo de `POST /auth/refresh` |
| Token de padres | `POST /parent/session` con el PIN     | 10 min   | `X-Parent-Token: …`            |

- Los **refresh tokens rotan**: cada uso entrega uno nuevo y revoca el anterior. Si alguien reutiliza uno ya revocado, se cierran todas las sesiones de la cuenta.
- Se usan headers y no cookies porque el APK de Capacitor corre en otro origen y ahí las cookies dan problemas.

## Endpoints

| Área        | Endpoints principales                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cuenta      | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET/PATCH /me`                                                                 |
| Padres      | `PUT /parent/pin`, `POST /parent/session`                                                                                                                             |
| Perfiles    | `GET/POST /children`, `GET/PATCH /children/:id`, `DELETE /children/:id`🔒, `PATCH /children/:id/settings`🔒, `GET /children/:id/summary`🔒, `GET /children/:id/stars` |
| Aprendizaje | `GET /topics`, `GET /topics/:slug`, `GET /activities/:id`, `GET /children/:id/progress`, `POST /children/:id/activities/:activityId/attempts`                         |
| Juegos      | `GET /games`, `POST /children/:id/games/:slug/sessions`                                                                                                               |
| Tienda      | `GET /shop/items`, `GET /children/:id/items`, `POST /children/:id/items/:itemId/purchase`, `PATCH /children/:id/items/:itemId`                                        |
| Lumi (IA)   | `GET /children/:id/lumi`, `GET/POST /children/:id/lumi/questions`                                                                                                     |
| Sistema     | `GET /health`                                                                                                                                                         |

🔒 = requiere el token de padres. Todas las rutas van bajo el prefijo `/api`.

## Errores

Las respuestas de error siguen el formato de NestJS:

```json
{ "statusCode": 400, "message": "No tienes suficientes estrellas", "error": "Bad Request" }
```

Los mensajes están en español y pensados para mostrarse directamente en la interfaz.

| Código | Cuándo                                                                 |
| ------ | ---------------------------------------------------------------------- |
| 400    | Datos inválidos o regla de negocio (sin estrellas, máximo de perfiles) |
| 401    | Falta el access token o expiró                                         |
| 403    | Falta el PIN de padres, o Lumi no está activado                        |
| 404    | El recurso no existe o pertenece a otra cuenta                         |
| 409    | Duplicado (email registrado, objeto ya comprado)                       |
| 429    | Demasiados intentos, o límite diario de preguntas                      |
| 503    | La base de datos o Lumi no están disponibles                           |
