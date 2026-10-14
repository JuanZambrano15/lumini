import type { ReactNode } from 'react';
import { Link } from 'react-router';
import logo from '@/assets/brand/logo.webp';
import { box, DESIGN_H, DESIGN_W, dp } from '@/lib/stage';

interface StageProps {
  /** Color que rellena los bordes cuando la pantalla no tiene la proporción del Figma. */
  background: string;
  /** A dónde lleva el botón "Salir". */
  exitTo: string;
  exitLabel?: string;
  /** Color del botón "Salir" (cambia entre escenas en el Figma). */
  exitClassName?: string;
  /** Título para lectores de pantalla (las escenas no muestran título visible). */
  title: string;
  children: ReactNode;
}

/**
 * Escenario de las pantallas infantiles del Figma (1440×710): logo arriba a la
 * izquierda y "Salir" abajo a la derecha. Mantiene la proporción del diseño y
 * escala todo junto, así las zonas clicables caen siempre sobre el dibujo.
 */
export function Stage({
  background,
  exitTo,
  exitLabel = 'Salir',
  exitClassName = 'bg-salir',
  title,
  children,
}: StageProps) {
  return (
    <div className="fixed inset-0 grid place-items-center overflow-hidden" style={{ background }}>
      <h1 className="sr-only">{title}</h1>
      <div
        className="@container relative overflow-hidden"
        style={{
          width: `min(100vw, calc(100dvh * ${DESIGN_W} / ${DESIGN_H}))`,
          aspectRatio: `${DESIGN_W} / ${DESIGN_H}`,
        }}
      >
        {children}

        <Link
          to="/mundo"
          aria-label="Lumini, ir al mundo"
          className="absolute z-30 rounded-xl transition hover:scale-105"
          // En celulares el logo del Figma (73 px) quedaría diminuto: mínimo 52 px.
          style={{ ...box(4, 3, 73, 65), width: `max(${dp(73)}, 52px)`, height: 'auto' }}
        >
          <img src={logo} alt="" className="w-full object-contain" />
        </Link>

        <Link
          to={exitTo}
          className={`absolute z-30 grid min-h-9 min-w-20 place-items-center rounded-full font-medium text-ink shadow-sm transition hover:brightness-95 focus-visible:outline-4 ${exitClassName}`}
          // Anclado abajo a la derecha: en pantallas chicas crece hacia adentro y no se corta.
          style={{
            right: `${(21 / DESIGN_W) * 100}%`,
            bottom: `${(15 / DESIGN_H) * 100}%`,
            width: dp(97),
            height: dp(27),
            fontSize: `max(${dp(17)}, 15px)`,
          }}
        >
          {exitLabel}
        </Link>
      </div>

      <p className="pointer-events-none fixed inset-x-3 bottom-3 rounded-2xl bg-white/90 p-3 text-center text-sm font-semibold text-ink shadow landscape:hidden sm:hidden">
        📱↻ Gira el celular para ver el mundo más grande
      </p>
    </div>
  );
}
