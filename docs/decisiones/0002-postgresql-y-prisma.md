# 0002. PostgreSQL y Prisma en lugar de Firebase

- **Estado**: aceptada
- **Fecha**: 2026-10

## Contexto

Firebase (Firestore) obligaba a duplicar datos y a manejar la consistencia a mano. Ya había un bug real: los perfiles se creaban en `parents/{uid}/children`, pero se leían de `users/{uid}/children`, así que nunca aparecían. Además, los datos del dominio son claramente relacionales.

## Decisión

Usar PostgreSQL 16 con Prisma 7 como ORM, con migraciones versionadas.

## Alternativas consideradas

- **Seguir con Firestore**: sin transacciones entre colecciones ni integridad referencial.
- **TypeORM**: integrado con NestJS, pero con tipos menos precisos y migraciones más frágiles.
- **Drizzle**: buen candidato, pero con menos documentación y ejemplos para un equipo que está aprendiendo.

## Consecuencias

- Integridad con llaves foráneas y transacciones para el saldo de estrellas.
- Tipos generados automáticamente a partir del esquema.
- Se necesita un servidor de base de datos (resuelto con Docker).
