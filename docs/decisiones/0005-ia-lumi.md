# 0005. Lumi: IA con la API de Claude y capas de seguridad

- **Estado**: reemplazada por [0006](0006-gemini-para-lumi.md): el proveedor cambió a Gemini; las capas de seguridad se mantienen
- **Fecha**: 2026-10

## Contexto

"Cumplir deseos" en el pozo consiste en que el niño pueda hacerle preguntas a una IA. Los usuarios son menores de edad, así que la seguridad es el requisito principal.

## Decisión

- Usar la API de Claude (SDK oficial `@anthropic-ai/sdk`) con el modelo `claude-opus-5-5`, configurable.
- Una sola llamada que responde y clasifica la pregunta, con salida estructurada validada con zod.
- Filtros locales antes y después de la IA, permiso de padres desactivado por defecto, límites diarios e historial visible para los padres.
- La función se desactiva sola si no hay clave configurada.

Detalle completo en [IA y seguridad infantil](../ia-y-seguridad.md).

## Consecuencias

- Las preguntas tienen un costo real por uso de la API, que se controla con el límite diario y el costo en estrellas.
- La calidad del filtro depende en parte del modelo; por eso los casos delicados siempre muestran mensajes fijos escritos por el equipo.
