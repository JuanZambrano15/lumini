import { useState } from 'react';
import { Link } from 'react-router';
import { useCurrentChild } from '@/auth/useActiveChild';
import mundo from '@/assets/scenes/mundo.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';

type Rect = [x: number, y: number, w: number, h: number];

interface Place {
  to: string;
  label: string;
  /** Zona clicable sobre el dibujo (px del Figma). */
  area: Rect;
  /** Dónde se para el personaje al señalar el lugar ("children zona 2–6" del Figma). */
  avatar: Rect;
  glow: string;
}

const places: Place[] = [
  {
    to: '/casa',
    label: 'Mi casa',
    area: [270, 280, 345, 200],
    avatar: [391, 302, 113, 196],
    glow: 'rgba(255, 214, 0, 0.6)',
  },
  {
    to: '/pozo',
    label: 'Pozo de los deseos',
    area: [598, 225, 195, 250],
    avatar: [697, 300, 106, 184],
    glow: 'rgba(0, 255, 230, 0.55)',
  },
  {
    to: '/salon',
    label: 'Salón de clases',
    area: [775, 295, 210, 160],
    avatar: [826, 333, 76, 132],
    glow: 'rgba(140, 255, 120, 0.55)',
  },
  {
    to: '/juegos',
    label: 'Juegos',
    area: [905, 380, 255, 175],
    avatar: [956, 394, 110, 190],
    glow: 'rgba(214, 255, 0, 0.6)',
  },
  {
    to: '/logros',
    label: 'Mis estrellas',
    area: [895, 85, 195, 180],
    avatar: [965, 143, 64, 111],
    glow: 'rgba(214, 255, 60, 0.6)',
  },
];

/** Posición del personaje cuando no señala ningún lugar ("children zona" del Figma). */
const IDLE: Rect = [443, 327, 221, 383];

export function WorldPage() {
  const { data: child } = useCurrentChild();
  const [active, setActive] = useState<Place | null>(null);
  const avatar = active?.avatar ?? IDLE;

  return (
    <Stage background="#6aa253" exitTo="/perfiles" title="Mundo Lumini">
      {/* Fondo tal como se ve en el frame del Figma (1440×710). */}
      <img
        src={mundo}
        alt="Campamento con una carpa naranja, un pozo, una carpa azul, una carpa morada y una casa del árbol"
        className="absolute inset-0 size-full"
      />

      {places.map((place) => (
        <Link
          key={place.to}
          to={place.to}
          aria-label={place.label}
          onPointerEnter={() => setActive(place)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(place)}
          onBlur={() => setActive(null)}
          className="group absolute z-10 rounded-[40%] focus-visible:outline-none"
          style={box(...place.area)}
        >
          <span
            aria-hidden
            className="absolute -inset-[14%] rounded-full opacity-0 blur-md transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            // Anillo de luz alrededor del lugar (como el brillo exterior del Figma): el centro
            // queda transparente para no teñir el dibujo.
            style={{
              background: `radial-gradient(closest-side, transparent 55%, ${place.glow} 75%, transparent 100%)`,
            }}
          />
          <span
            className="absolute -top-[18%] left-1/2 -translate-x-1/2 rounded-full bg-white px-[0.8em] py-[0.2em] font-semibold whitespace-nowrap text-ink opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{ fontSize: `max(${dp(20)}, 13px)` }}
          >
            {place.label}
          </span>
        </Link>
      ))}

      {child && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 transition-all duration-500 ease-out motion-reduce:transition-none"
          style={box(...avatar)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
    </Stage>
  );
}
