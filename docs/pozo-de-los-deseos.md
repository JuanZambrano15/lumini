# Pozo de los deseos

El pozo es la recompensa de Lumini: el niño **lanza las estrellas** que ganó aprendiendo para cumplir sus deseos. Tiene dos objetivos.

## 1. Tienda de personalización

El niño canjea estrellas por objetos para su **avatar** (gorra, corona, gafas, mochila…) y su **casa** (osito, cuadro, trofeo, mariposa…).

- Cada objeto ocupa un **espacio** (`slot`): cabeza, cara y espalda en el avatar; piso, pared, repisa y ventana en la casa.
- Solo puede haber un objeto equipado por espacio. Al equipar uno, el anterior del mismo espacio se guarda.
- Lo recién comprado se equipa automáticamente.
- Los accesorios se ven en el clóset, en la barra superior y en la selección de perfiles; las decoraciones, en la escena de la casa.
- Los objetos se dibujan con emojis, así se pueden agregar sin diseñar imágenes nuevas. Para cambiarlos por ilustraciones propias basta con reemplazar el emoji por una imagen en `apps/web/src/features/well/`.

Para agregar objetos: edita `shopItems` en `apps/api/src/database/seed-data.ts`.

## 2. Pedir un deseo: preguntarle a Lumi

El niño gasta estrellas para hacerle una pregunta a **Lumi**, un asistente con inteligencia artificial que responde con lenguaje para niños. Detalles de seguridad en [IA y seguridad infantil](ia-y-seguridad.md).

- Los **padres deben activarlo** para cada perfil (viene apagado).
- Cada pregunta cuesta `LUMI_QUESTION_COST` estrellas (5 por defecto) y hay un máximo diario de `LUMI_DAILY_LIMIT` (10).
- Si la pregunta se bloquea por el filtro local, **no se cobra**.
- Si Lumi falla, **se devuelven las estrellas**.

## Cómo se ganan las estrellas

| Acción                                        | Estrellas                                                         |
| --------------------------------------------- | ----------------------------------------------------------------- |
| Actividad o evaluación                        | Una por cada acierto **por encima de tu récord** en esa actividad |
| Aprobar una evaluación por primera vez (≥80%) | +3 de bono                                                        |
| Juego                                         | De 0 a 3 según el puntaje, máximo 10 por juego cada 24 h          |

Ganar solo al superar el récord premia mejorar y evita que el niño repita lo mismo para acumular estrellas.
