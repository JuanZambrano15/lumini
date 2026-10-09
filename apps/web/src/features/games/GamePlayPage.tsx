import type { ComponentType } from 'react';
import { Navigate, useParams } from 'react-router';
import { useGames } from '@/api/hooks';
import juegos from '@/assets/scenes/juegos.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { MemoryGame } from './memory/MemoryGame';
import { OddFishGame } from './odd-fish/OddFishGame';
import { TicTacToeGame } from './tic-tac-toe/TicTacToeGame';

/** Juegos implementados en el cliente. El slug coincide con el de la base de datos. */
const implementedGames: Record<string, ComponentType> = {
  'tres-en-raya': TicTacToeGame,
  cartas: MemoryGame,
  'pez-diferente': OddFishGame,
};

export function GamePlayPage() {
  const { slug = '' } = useParams();
  const { data: games } = useGames();
  const Game = implementedGames[slug];

  if (!Game) return <Navigate to="/juegos" replace />;
  const name = games?.find((game) => game.slug === slug)?.name ?? 'Juego';

  return (
    <ChildLayout title={name} backTo="/juegos" background={juegos}>
      <section className="mx-auto max-w-2xl rounded-3xl bg-white/95 p-6 shadow-xl">
        <Game />
      </section>
    </ChildLayout>
  );
}
