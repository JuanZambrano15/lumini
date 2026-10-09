import { clamp, type Random } from '../shared';

export const TOTAL_ROUNDS = 8;

export interface Round {
  /** Lado de la cuadrícula (3 → 3x3). Crece con el nivel. */
  size: number;
  oddIndex: number;
  common: string;
  odd: string;
}

const PAIRS: [string, string][] = [
  ['🐟', '🐠'],
  ['🐠', '🐡'],
  ['🐳', '🐋'],
  ['🦀', '🦞'],
  ['🐙', '🦑'],
];

export function createRound(round: number, random: Random = Math.random): Round {
  const size = round < 3 ? 3 : round < 6 ? 4 : 5;
  const [common, odd] = PAIRS[Math.floor(random() * PAIRS.length)];
  return { size, oddIndex: Math.floor(random() * size * size), common, odd };
}

/** Puntaje 0-100: aciertos menos una penalización por cada toque equivocado. */
export function oddFishScore(correct: number, mistakes: number): number {
  return clamp(Math.round((correct / TOTAL_ROUNDS) * 100 - mistakes * 5), 0, 100);
}
