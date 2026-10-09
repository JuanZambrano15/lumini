import type { ReactNode } from 'react';
import { Link } from 'react-router';

export interface Hotspot {
  to: string;
  label: string;
  emoji: string;
  /** Posición y tamaño en porcentaje de la imagen, así funciona en cualquier pantalla. */
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SceneProps {
  image: string;
  alt: string;
  hotspots: Hotspot[];
  /** Elementos extra dibujados sobre la imagen (p. ej. decoraciones de la casa). */
  overlay?: ReactNode;
}

/**
 * Escena ilustrada con zonas clicables. La versión anterior usaba márgenes
 * fijos en píxeles y se rompía en cualquier pantalla distinta a la del autor;
 * aquí todo se posiciona en % sobre un contenedor con la proporción de la imagen.
 * Debajo se repiten los destinos como botones grandes (útil en celular y con lector de pantalla).
 */
export function Scene({ image, alt, hotspots, overlay }: SceneProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="@container relative aspect-video w-full max-w-[calc((100dvh-9rem)*16/9)] overflow-hidden rounded-3xl shadow-xl ring-4 ring-white">
        <img src={image} alt={alt} className="absolute inset-0 size-full object-cover" />
        {overlay}
        {hotspots.map((spot) => (
          <Link
            key={spot.to}
            to={spot.to}
            aria-hidden
            tabIndex={-1}
            className="group absolute rounded-[2rem] transition hover:bg-white/20"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.w}%`,
              height: `${spot.h}%`,
            }}
          >
            <span className="absolute -top-3 left-1/2 hidden -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-sm font-extrabold whitespace-nowrap text-brand-700 shadow transition group-hover:scale-110 sm:block">
              {spot.emoji} {spot.label}
            </span>
          </Link>
        ))}
      </div>

      <nav aria-label="Lugares" className="flex flex-wrap justify-center gap-2">
        {hotspots.map((spot) => (
          <Link
            key={spot.to}
            to={spot.to}
            className="rounded-full bg-white px-4 py-2 font-bold text-brand-700 shadow ring-2 ring-brand-200 hover:bg-brand-100"
          >
            {spot.emoji} {spot.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
