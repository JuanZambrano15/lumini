import { computeGameStars, DAILY_GAME_STAR_CAP } from './game-stars';

describe('computeGameStars', () => {
  it('convierte el puntaje en estrellas proporcionales', () => {
    expect(computeGameStars(100, 3, 0)).toBe(3);
    expect(computeGameStars(50, 3, 0)).toBe(2);
    expect(computeGameStars(0, 3, 0)).toBe(0);
  });

  it('acota puntajes fuera de rango', () => {
    expect(computeGameStars(999, 3, 0)).toBe(3);
    expect(computeGameStars(-10, 3, 0)).toBe(0);
  });

  it('respeta el tope diario', () => {
    expect(computeGameStars(100, 3, DAILY_GAME_STAR_CAP - 1)).toBe(1);
    expect(computeGameStars(100, 3, DAILY_GAME_STAR_CAP)).toBe(0);
  });
});
