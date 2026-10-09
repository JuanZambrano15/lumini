import { describe, expect, it } from 'vitest';
import { createRound, oddFishScore, TOTAL_ROUNDS } from './logic';

describe('el pez diferente', () => {
  it('la cuadrícula crece con las rondas', () => {
    expect(createRound(0).size).toBe(3);
    expect(createRound(4).size).toBe(4);
    expect(createRound(7).size).toBe(5);
  });

  it('el pez diferente siempre está dentro de la cuadrícula', () => {
    for (let round = 0; round < TOTAL_ROUNDS; round++) {
      const { size, oddIndex, common, odd } = createRound(round);
      expect(oddIndex).toBeGreaterThanOrEqual(0);
      expect(oddIndex).toBeLessThan(size * size);
      expect(common).not.toBe(odd);
    }
  });

  it('penaliza los errores sin bajar de 0', () => {
    expect(oddFishScore(TOTAL_ROUNDS, 0)).toBe(100);
    expect(oddFishScore(TOTAL_ROUNDS, 2)).toBe(90);
    expect(oddFishScore(0, 10)).toBe(0);
  });
});
