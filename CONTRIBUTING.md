# Cómo contribuir a Lumini

## Flujo de trabajo (GitHub Flow)

1. Toda tarea empieza con un **issue** (usa las plantillas de bug o de funcionalidad).
2. Crea una rama desde `main` con un prefijo según el tipo de cambio:
   - `feat/pozo-animacion`: nueva funcionalidad
   - `fix/login-error-mensaje`: corrección de errores
   - `chore/actualizar-deps`, `docs/readme-apk`, `test/wishes-e2e`
3. Haz commits pequeños siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).
4. Abre un **pull request** hacia `main` y enlaza el issue (`Closes #12`).
5. La CI debe pasar y otra persona del equipo debe revisar el PR antes del merge.
6. Se hace merge con **squash** para que cada PR quede como un solo commit limpio en `main`.

`main` siempre debe poder desplegarse. No se hace push directo a `main`.

## Mensajes de commit

```
<tipo>(<ámbito>): <descripción en imperativo>
```

- **Tipos**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`.
- **Ámbitos**: `api`, `web`, `db`, `docker`, `ci`, `deps`, `docs`, `repo`.

Ejemplos:

```
feat(web): add coin animation to the wishing well
fix(api): refund stars when a wish is rejected
test(api): cover parent PIN rate limiting
```

Un hook de `commitlint` valida el formato al hacer commit.

## Antes de abrir un PR

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test
```

## Convenciones de código

- TypeScript estricto en todo el proyecto, sin `any`.
- Identificadores en inglés; textos de la interfaz, comentarios y documentación en español.
- Comentarios para explicar el **porqué** (reglas de negocio, decisiones de seguridad), no lo que el código ya dice.
- La lógica de negocio vive en la API. El frontend nunca decide cuántas estrellas se ganan ni si una respuesta es correcta.
- La lógica pura (calificación, reglas de estrellas, lógica de los juegos) va en funciones separadas y con tests.
- Los cambios de base de datos se hacen con migraciones de Prisma (`pnpm --filter @lumini/api db:migrate`), nunca editando la base a mano.

## Versiones

Se usa [SemVer](https://semver.org/lang/es/). Cada entrega se marca con un tag y un release en GitHub (`v1.0.0`, `v1.1.0`, …).
