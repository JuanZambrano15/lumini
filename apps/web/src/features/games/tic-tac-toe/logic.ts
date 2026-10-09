import type { Random } from '../shared';

export type Mark = 'X' | 'O';
export type Cell = Mark | null;
export type Board = Cell[];

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const emptyBoard = (): Board => Array<Cell>(9).fill(null);

export function getWinner(board: Board): Mark | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export const isFull = (board: Board) => board.every((cell) => cell !== null);

/** Busca la casilla que completa una línea para `mark`, si existe. */
function findLineCompletion(board: Board, mark: Mark): number | null {
  for (const line of LINES) {
    const marks = line.filter((index) => board[index] === mark).length;
    const empty = line.find((index) => board[index] === null);
    if (marks === 2 && empty !== undefined) return empty;
  }
  return null;
}

/**
 * Jugada de Lumi (la computadora). No es invencible a propósito, para que
 * los niños puedan ganar: gana si puede, bloquea si debe, si no prefiere el
 * centro y luego una casilla al azar.
 */
export function chooseComputerMove(board: Board, random: Random = Math.random): number {
  const win = findLineCompletion(board, 'O');
  if (win !== null) return win;

  const block = findLineCompletion(board, 'X');
  if (block !== null) return block;

  if (board[4] === null) return 4;

  const free = board.flatMap((cell, index) => (cell === null ? [index] : []));
  return free[Math.floor(random() * free.length)];
}

export type Outcome = 'win' | 'draw' | 'loss';

export const OUTCOME_SCORE: Record<Outcome, number> = { win: 100, draw: 60, loss: 20 };
