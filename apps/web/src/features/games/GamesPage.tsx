import { useState } from 'react';
import { Link } from 'react-router';
import { useGames } from '@/api/hooks';
import type { GameCategory } from '@/api/types';
import juegos from '@/assets/scenes/juegos.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { gameImages } from '@/lib/assets';

const categories: { key: GameCategory; label: string; short: string; color: string }[] = [
  { key: 'REASONING', label: 'Razonamiento', short: 'R', color: 'bg-lime' },
  { key: 'MEMORY', label: 'Memoria', short: 'M', color: 'bg-sun' },
  { key: 'ATTENTION', label: 'Atención', short: 'A', color: 'bg-bubblegum' },
];

export function GamesPage() {
  const { data: games, isLoading, error, refetch } = useGames();
  const [category, setCategory] = useState<GameCategory>('REASONING');
  const visible = games?.filter((game) => game.category === category) ?? [];

  return (
    <ChildLayout title="Juegos" backTo="/mundo" background={juegos}>
      <section className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#ab90d6]/95 p-4 shadow-2xl sm:p-8">
        <div role="tablist" aria-label="Categorías" className="mb-6 flex justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={category === item.key}
              onClick={() => setCategory(item.key)}
              className={`rounded-full px-4 py-2 font-display text-lg font-extrabold transition ${
                category === item.key ? `${item.color} text-ink shadow` : 'bg-white/50 text-ink/70'
              }`}
            >
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}

        <ul className="grid grid-cols-2 gap-4 rounded-3xl bg-[#fffac7] p-4 lg:grid-cols-4">
          {visible.map((game) => {
            const content = (
              <>
                <img
                  src={gameImages[game.slug]}
                  alt=""
                  className="mx-auto size-24 object-contain"
                />
                <span className="font-display text-lg font-extrabold">{game.name}</span>
                <span className="text-sm text-ink/70">
                  {game.isAvailable ? game.description : 'Próximamente'}
                </span>
              </>
            );
            return (
              <li key={game.id}>
                {game.isAvailable ? (
                  <Link
                    to={`/juegos/${game.slug}`}
                    className="flex h-full flex-col items-center gap-1 rounded-2xl bg-white p-4 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    aria-disabled
                    className="flex h-full flex-col items-center gap-1 rounded-2xl bg-white/60 p-4 text-center opacity-60 grayscale"
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </ChildLayout>
  );
}
