# Decisiones de arquitectura (ADR)

Registro de las decisiones técnicas importantes: qué se decidió, por qué y qué alternativas se descartaron. Formato basado en [ADR de Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

| #    | Decisión                                                                | Estado               |
| ---- | ----------------------------------------------------------------------- | -------------------- |
| 0001 | [Monorepo con API y web separadas](0001-monorepo.md)                    | Aceptada             |
| 0002 | [PostgreSQL y Prisma en lugar de Firebase](0002-postgresql-y-prisma.md) | Aceptada             |
| 0003 | [NestJS para la API](0003-nestjs.md)                                    | Aceptada             |
| 0004 | [React + Vite + Capacitor para web y APK](0004-vite-y-capacitor.md)     | Aceptada             |
| 0005 | [Lumi: IA con la API de Claude y capas de seguridad](0005-ia-lumi.md)   | Reemplazada por 0006 |
| 0006 | [Gemini como proveedor de IA de Lumi](0006-gemini-para-lumi.md)         | Aceptada             |

Para agregar una decisión, copia la estructura de una existente con el siguiente número.
