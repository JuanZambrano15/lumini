# Documentación de Lumini

Documentación técnica del proyecto. Cada archivo cubre un tema; si agregas algo nuevo, enlázalo aquí.

| Documento                                    | Contenido                                                    |
| -------------------------------------------- | ------------------------------------------------------------ |
| [Desarrollo local](desarrollo-local.md)      | Cómo correr el proyecto en tu máquina y ver la base de datos |
| [Arquitectura](arquitectura.md)              | Piezas del sistema, carpetas y cómo viaja una petición       |
| [Base de datos](base-de-datos.md)            | Modelo relacional, tablas y cómo crear migraciones           |
| [API](api.md)                                | Autenticación, modo padres y resumen de endpoints            |
| [Pozo de los deseos](pozo-de-los-deseos.md)  | Estrellas, tienda de personalización y preguntas a Lumi      |
| [IA y seguridad infantil](ia-y-seguridad.md) | Cómo se protege a los niños al usar la IA                    |
| [Despliegue](despliegue.md)                  | Producción con Docker y generación del APK                   |
| [Decisiones de arquitectura](decisiones/)    | Por qué elegimos cada tecnología (ADRs)                      |

## Convenciones para escribir documentación

- Un tema por archivo, en español, con títulos claros.
- Si una decisión cambia, no borres el ADR anterior: crea uno nuevo que lo reemplace.
- Los diagramas van en [Mermaid](https://mermaid.js.org/) dentro del Markdown, así GitHub los dibuja y se pueden versionar.
