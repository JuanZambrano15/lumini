import { describe, expect, it } from 'vitest';
import { createDeck, memoryScore } from './logic';

describe('cartas de memoria', () => {
  it('crea exactamente dos cartas por símbolo', () => {
    const deck = createDeck(6);
    expect(deck).toHaveLength(12);
    const counts = new Map<string, number>();
    deck.forEach((card) => counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1));
    expect([...counts.values()].every((count) => count === 2)).toBe(true);
  });

  it('da 100 puntos a una partida perfecta y nunca menos de 20', () => {
    expect(memoryScore(6, 6)).toBe(100);
    expect(memoryScore(10, 6)).toBe(68);
    expect(memoryScore(100, 6)).toBe(20);
  });
});
