import type { CSSProperties } from 'react';

/** Tamaño de los frames del Figma. Todo dentro del escenario se ubica en estas coordenadas. */
export const DESIGN_W = 1440;
export const DESIGN_H = 710;

/** Caja en píxeles del Figma → porcentajes del escenario (escala igual en cualquier pantalla). */
export function box(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    left: `${(x / DESIGN_W) * 100}%`,
    top: `${(y / DESIGN_H) * 100}%`,
    width: `${(w / DESIGN_W) * 100}%`,
    height: `${(h / DESIGN_H) * 100}%`,
  };
}

/** Tamaño en píxeles del Figma → unidad relativa al ancho del escenario (cqw). */
export const dp = (px: number) => `${(px / DESIGN_W) * 100}cqw`;
