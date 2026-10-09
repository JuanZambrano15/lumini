import { useState } from 'react';
import { GameResult } from '../GameResult';
import { useGameSession } from '../useGameSession';
import { createRound, oddFishScore, TOTAL_ROUNDS } from './logic';

export function OddFishGame() {
  const session = useGameSession('pez-diferente');
  const [roundNumber, setRoundNumber] = useState(0);
  const [round, setRound] = useState(() => createRound(0));
  const [mistakes, setMistakes] = useState(0);
  const [wrongCell, setWrongCell] = useState<number | null>(null);

  const finished = roundNumber === TOTAL_ROUNDS;

  function pick(index: number) {
    if (index !== round.oddIndex) {
      setMistakes(mistakes + 1);
      setWrongCell(index);
      return;
    }

    const next = roundNumber + 1;
    setRoundNumber(next);
    setWrongCell(null);
    if (next === TOTAL_ROUNDS) {
      session.finish(oddFishScore(TOTAL_ROUNDS, mistakes));
    } else {
      setRound(createRound(next));
    }
  }

  function restart() {
    setRoundNumber(0);
    setRound(createRound(0));
    setMistakes(0);
    setWrongCell(null);
    session.restart();
  }

  if (finished) {
    return (
      <GameResult
        title="¡Encontraste todos los peces! 🐠"
        detail={
          mistakes === 0
            ? '¡Sin ningún error!'
            : `Te equivocaste ${mistakes} ${mistakes === 1 ? 'vez' : 'veces'}`
        }
        starsEarned={session.starsEarned}
        isSaving={session.isSaving}
        error={session.error}
        onPlayAgain={restart}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-bold">
        Ronda {roundNumber + 1} de {TOTAL_ROUNDS} · Encuentra el que es diferente
      </p>
      <div
        className="grid gap-1 rounded-3xl bg-sky p-2"
        style={{ gridTemplateColumns: `repeat(${round.size}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: round.size * round.size }, (_, index) => (
          <button
            key={`${roundNumber}-${index}`}
            type="button"
            onClick={() => pick(index)}
            aria-label={`Pez ${index + 1}`}
            className={`grid size-14 place-items-center rounded-xl text-3xl transition hover:bg-white/50 sm:size-16 sm:text-4xl ${
              wrongCell === index ? 'bg-red-200' : ''
            }`}
          >
            {index === round.oddIndex ? round.odd : round.common}
          </button>
        ))}
      </div>
    </div>
  );
}
