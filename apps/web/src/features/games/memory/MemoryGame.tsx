import { useState } from 'react';
import { GameResult } from '../GameResult';
import { useGameSession } from '../useGameSession';
import { createDeck, memoryScore } from './logic';

const PAIRS = 6;
const HIDE_DELAY_MS = 800;

export function MemoryGame() {
  const session = useGameSession('cartas');
  const [deck, setDeck] = useState(() => createDeck(PAIRS));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);

  const finished = matched.size === deck.length;

  function flip(id: number) {
    if (flipped.length === 2 || flipped.includes(id) || matched.has(id)) return;

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);
    const [first, second] = nextFlipped.map((cardId) => deck[cardId]);

    if (first.symbol === second.symbol) {
      const nextMatched = new Set(matched).add(first.id).add(second.id);
      setMatched(nextMatched);
      setFlipped([]);
      if (nextMatched.size === deck.length) session.finish(memoryScore(nextMoves, PAIRS));
    } else {
      window.setTimeout(() => setFlipped([]), HIDE_DELAY_MS);
    }
  }

  function restart() {
    setDeck(createDeck(PAIRS));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    session.restart();
  }

  if (finished) {
    return (
      <GameResult
        title="¡Encontraste todas las parejas! 🎉"
        detail={`Lo lograste en ${moves} movimientos`}
        starsEarned={session.starsEarned}
        isSaving={session.isSaving}
        error={session.error}
        onPlayAgain={restart}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-bold">Movimientos: {moves}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((card) => {
          const visible = flipped.includes(card.id) || matched.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card.id)}
              aria-label={visible ? card.symbol : 'Carta boca abajo'}
              className={`grid size-20 place-items-center rounded-2xl text-4xl shadow-md transition sm:size-24 ${
                matched.has(card.id)
                  ? 'bg-lime'
                  : visible
                    ? 'bg-white'
                    : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {visible ? card.symbol : <span className="text-2xl text-white">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
