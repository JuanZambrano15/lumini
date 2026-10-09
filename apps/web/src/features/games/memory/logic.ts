import { clamp, type Random, shuffle } from '../shared';

export interface MemoryCard {
  id: number;
  symbol: string;
}

const SYMBOLS = ['🐶', '🐱', '🦊', '🐸', '🐵', '🐼', '🦁', '🐰'];

/** Crea un mazo con `pairs` parejas mezcladas. */
export function createDeck(pairs: number, random: Random = Math.random): MemoryCard[] {
  const symbols = SYMBOLS.slice(0, pairs);
  return shuffle([...symbols, ...symbols], random).map((symbol, id) => ({ id, symbol }));
}

/**
 * Puntaje 0-100 según la eficiencia: encontrar todas las parejas sin errores
 * (un movimiento por pareja) da 100; cada movimiento extra resta.
 */
export function memoryScore(moves: number, pairs: number): number {
  return clamp(Math.round(100 - (moves - pairs) * 8), 20, 100);
}
