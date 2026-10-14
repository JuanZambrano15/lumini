import { useState } from 'react';
import { Link } from 'react-router';
import { useGames } from '@/api/hooks';
import type { GameCategory } from '@/api/types';
import { useCurrentChild } from '@/auth/useActiveChild';
import dados from '@/assets/scenes/juegos-dados.webp';
import juegos from '@/assets/scenes/juegos.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';
import { gameImages, gameLabels } from '@/lib/assets';

/** Pestañas tipo carpeta del Figma ("game zone 1–3"): cada categoría con su color. */
const categories: {
  key: GameCategory;
  label: string;
  tab: string;
  panel: string;
  frame: string;
  initial: string;
}[] = [
  {
    key: 'REASONING',
    label: 'Razonamiento',
    tab: '#acebce',
    panel: '#c9f0e1',
    frame: '#1fa2bd',
    initial: '#0e7f96',
  },
  {
    key: 'MEMORY',
    label: 'Memoria',
    tab: '#fef3b4',
    panel: '#fff8c9',
    frame: '#f3e39a',
    initial: '#c77c00',
  },
  {
    key: 'ATTENTION',
    label: 'Atención',
    tab: '#ff66c4',
    panel: '#e06eb5',
    frame: '#9c1c6b',
    initial: '#8a0f5b',
  },
];

export function GamesPage() {
  const { data: child } = useCurrentChild();
  const { data: games, isLoading, error, refetch } = useGames();
  const [category, setCategory] = useState<GameCategory>('REASONING');
  const active = categories.find((item) => item.key === category) ?? categories[0];
  const visible = games?.filter((game) => game.category === category) ?? [];

  return (
    <Stage background="var(--color-games-bg)" exitTo="/mundo" title="Juegos">
      {/* Posición de la ilustración medida sobre el frame "game zone" del Figma. */}
      <img src={juegos} alt="" className="absolute max-w-none" style={box(55, 0, 1340, 755)} />

      {/* Pestañas: la activa muestra el nombre completo; las demás, solo la inicial. */}
      <div
        role="tablist"
        aria-label="Categorías de juegos"
        className="absolute z-10 flex items-end"
        style={box(128, 85, 900, 63)}
      >
        {categories.map((item, index) => {
          const selected = item.key === category;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={selected}
              aria-controls="panel-juegos"
              aria-label={item.label}
              onClick={() => setCategory(item.key)}
              className="relative h-full rounded-t-[2.2cqw] font-bold transition hover:brightness-105"
              style={{
                background: item.tab,
                width: selected ? 'auto' : dp(80),
                paddingInline: selected ? dp(24) : 0,
                marginLeft: index === 0 ? 0 : dp(-8),
                zIndex: selected ? 3 : categories.length - index,
                fontSize: dp(36),
                color: '#2b2b2b',
              }}
            >
              <span aria-hidden style={{ color: item.initial }}>
                {item.label[0]}
              </span>
              {selected && <span aria-hidden>{item.label.slice(1)}</span>}
            </button>
          );
        })}
      </div>

      <section
        id="panel-juegos"
        role="tabpanel"
        aria-labelledby={`tab-${active.key}`}
        className="absolute z-10 rounded-tr-[2cqw] transition-colors"
        style={{ ...box(128, 147, 1180, 600), background: active.panel }}
      >
        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}

        <ul className="absolute flex gap-[3.4cqw]" style={box(65, 190, 1100, 300)}>
          {visible.map((game) => {
            const content = (
              <>
                <span
                  className="block aspect-square w-full bg-white"
                  style={{ border: `${dp(15)} solid ${active.frame}` }}
                >
                  <img
                    src={gameImages[game.slug]}
                    alt=""
                    className="size-full object-contain p-[0.6cqw]"
                  />
                </span>
                <span
                  className="mt-[0.8cqw] block text-center leading-tight font-black tracking-wide text-[#2b2b2b] uppercase"
                  style={{ fontSize: dp(34), textShadow: `0 ${dp(2)} 0 rgba(0,0,0,0.15)` }}
                >
                  {gameLabels[game.slug] ?? game.name}
                </span>
              </>
            );
            return (
              <li key={game.id} className="w-[15.7cqw] shrink-0">
                {game.isAvailable ? (
                  <Link
                    to={`/juegos/${game.slug}`}
                    title={game.description}
                    className="block transition hover:-translate-y-1"
                  >
                    {content}
                  </Link>
                ) : (
                  <div aria-disabled className="relative opacity-75 grayscale-[70%]">
                    {content}
                    <span
                      className="absolute top-[1.4cqw] left-1/2 -translate-x-1/2 rounded-full bg-white px-[0.7em] font-semibold text-ink shadow"
                      style={{ fontSize: `max(${dp(16)}, 11px)` }}
                    >
                      🔒 Pronto
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Los dados del fondo van por encima de la carpeta, como en el Figma. */}
      <img
        src={dados}
        alt=""
        className="pointer-events-none absolute z-[15] max-w-none"
        style={box(55, 503, 218, 252)}
      />

      {child && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={box(-6, 266, 221, 383)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
    </Stage>
  );
}
