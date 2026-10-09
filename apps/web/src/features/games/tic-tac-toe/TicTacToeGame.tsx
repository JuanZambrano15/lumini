import { useState } from 'react';
import { GameResult } from '../GameResult';
import { useGameSession } from '../useGameSession';
import {
  type Board,
  chooseComputerMove,
  emptyBoard,
  getWinner,
  isFull,
  OUTCOME_SCORE,
  type Outcome,
} from './logic';

const COMPUTER_DELAY_MS = 450;

const outcomeText: Record<Outcome, string> = {
  win: '¡Ganaste! 🎉',
  draw: '¡Empate! 🤝',
  loss: 'Ganó Lumi 💡',
};

function resolve(board: Board): Outcome | null {
  const winner = getWinner(board);
  if (winner === 'X') return 'win';
  if (winner === 'O') return 'loss';
  return isFull(board) ? 'draw' : null;
}

export function TicTacToeGame() {
  const session = useGameSession('tres-en-raya');
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [thinking, setThinking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  function end(result: Outcome) {
    setOutcome(result);
    session.finish(OUTCOME_SCORE[result]);
  }

  function play(index: number) {
    if (board[index] || thinking || outcome) return;

    const afterChild = board.with(index, 'X');
    setBoard(afterChild);
    const childResult = resolve(afterChild);
    if (childResult) return end(childResult);

    setThinking(true);
    window.setTimeout(() => {
      const afterComputer = afterChild.with(chooseComputerMove(afterChild), 'O');
      setBoard(afterComputer);
      setThinking(false);
      const computerResult = resolve(afterComputer);
      if (computerResult) end(computerResult);
    }, COMPUTER_DELAY_MS);
  }

  function restart() {
    setBoard(emptyBoard());
    setOutcome(null);
    session.restart();
  }

  if (outcome) {
    return (
      <GameResult
        title={outcomeText[outcome]}
        detail="Tú eres ❌ y Lumi es ⭕"
        starsEarned={session.starsEarned}
        isSaving={session.isSaving}
        error={session.error}
        onPlayAgain={restart}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-bold" aria-live="polite">
        {thinking ? 'Lumi está pensando…' : 'Tu turno: eres ❌'}
      </p>
      <div className="grid grid-cols-3 gap-2 rounded-3xl bg-brand-200 p-2">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => play(index)}
            disabled={cell !== null || thinking}
            aria-label={`Casilla ${index + 1}${cell ? `, ocupada por ${cell === 'X' ? 'ti' : 'Lumi'}` : ''}`}
            className="grid size-24 place-items-center rounded-2xl bg-white text-5xl shadow transition hover:bg-brand-50 disabled:cursor-default sm:size-28"
          >
            {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
