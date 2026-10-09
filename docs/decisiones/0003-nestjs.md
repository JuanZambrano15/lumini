# 0003. NestJS para la API

- **Estado**: aceptada
- **Fecha**: 2026-10

## Decisión

Usar NestJS 11 con TypeScript estricto.

## Motivos

- Estructura por módulos, inyección de dependencias, guards y DTOs validados: buenas prácticas por defecto.
- Swagger generado automáticamente a partir de los decoradores.
- El mismo lenguaje (TypeScript) en todo el proyecto.

## Por qué la 11 y no la 12

NestJS 12 salió en agosto de 2026 y pasó a ser solo ESM, con cambios en el ecosistema (Jest, configuración). Con una entrega en un mes se eligió la 11, estable y con soporte. Migrar a la 12 queda como tarea futura.
