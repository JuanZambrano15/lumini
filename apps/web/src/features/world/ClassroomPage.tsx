import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useCurrentChild } from '@/auth/useActiveChild';
import salon from '@/assets/scenes/salon-escena.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';

/** Metáfora del día en el tablero (en el Figma: "Hablemos del elefante en la habitación…"). */
const METAPHORS = [
  'Hablemos del elefante en la habitación…',
  'Tengo mariposas en el estómago.',
  'Está lloviendo a cántaros.',
  'Eres un sol.',
  'Tiene un corazón de oro.',
  'Mi hermano es una tortuga para vestirse.',
  'El tiempo vuela cuando juego.',
];

function metaphorOfTheDay() {
  const day = Math.floor(Date.now() / 86_400_000);
  return METAPHORS[day % METAPHORS.length];
}

export function ClassroomPage() {
  const { data: child } = useCurrentChild();

  return (
    <Stage background="#e9d9e3" exitTo="/mundo" title="Salón de clases">
      <img
        src={salon}
        alt="Salón de clases con tablero, pupitres y biblioteca"
        className="absolute inset-0 size-full"
      />

      {/* Tablero con la metáfora del día. */}
      <div
        className="absolute z-10 flex flex-col items-center text-center"
        style={box(606, 272, 250, 160)}
      >
        <p className="font-bold tracking-[0.06em] text-[#f6a882]" style={{ fontSize: dp(24) }}>
          Metáfora
        </p>
        <p className="mt-[0.3em] font-read leading-snug text-white" style={{ fontSize: dp(21) }}>
          “{metaphorOfTheDay()}”
        </p>
      </div>

      <Hotspot
        to="/mundo"
        label="Salir por la puerta"
        area={box(160, 192, 82, 310)}
        glow="rgba(255, 230, 140, 0.7)"
      />
      <Hotspot
        to="/estudio"
        label="Ir a estudiar"
        area={box(587, 498, 400, 201)}
        glow="rgba(64, 255, 214, 0.9)"
        alwaysGlow
      />

      {child && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={box(417, 328, 221, 383)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
    </Stage>
  );
}

interface HotspotProps {
  to: string;
  label: string;
  area: CSSProperties;
  glow: string;
  /** El pupitre brilla siempre en el Figma: indica dónde tocar para estudiar. */
  alwaysGlow?: boolean;
}

function Hotspot({ to, label, area, glow, alwaysGlow = false }: HotspotProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="group absolute z-10 rounded-[2rem] focus-visible:outline-none"
      style={area}
    >
      <span
        aria-hidden
        className={`absolute inset-0 rounded-[2rem] blur-md transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${alwaysGlow ? 'opacity-80' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(closest-side, transparent 50%, ${glow} 72%, transparent 100%)`,
        }}
      />
      <span
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 rounded-full bg-white px-[0.8em] py-[0.2em] font-semibold whitespace-nowrap text-ink opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ fontSize: `max(${dp(20)}, 13px)` }}
      >
        {label}
      </span>
    </Link>
  );
}
