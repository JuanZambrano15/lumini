# 0006. Gemini como proveedor de IA de Lumi

- **Estado**: aceptada (reemplaza a [0005](0005-ia-lumi.md) en la elección del proveedor)
- **Fecha**: 2026-10

## Contexto

Lumi responde preguntas cortas de niños. Es una tarea sencilla y de alto volumen potencial, donde el costo por pregunta pesa más que la capacidad máxima del modelo.

## Decisión

Usar la API de Gemini (Google) con el SDK oficial `@google/genai` y un modelo de la línea Flash-Lite (`gemini-3.1-flash-lite` por defecto, configurable con `LUMI_MODEL`).

Se mantienen todas las capas de seguridad de la decisión 0005: permiso de padres, límites, filtro local, clasificación estructurada, mensajes fijos y el historial para padres. Se suman los `safetySettings` de Gemini en su nivel más estricto.

## Consecuencias

- Menor costo por pregunta.
- El proveedor está aislado en `LumiAiService`: cambiarlo de nuevo solo toca ese archivo y la variable de la clave.
- La clave se crea gratis en Google AI Studio, lo que facilita las pruebas del equipo.
