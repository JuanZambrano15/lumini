/** Máximo de estrellas que un niño puede ganar por juego en 24 horas. */
export const DAILY_GAME_STAR_CAP = 10;

/**
 * Convierte el puntaje (0-100) en estrellas, respetando el máximo por partida
 * y el tope de 24 horas. El puntaje lo reporta el cliente, por eso los topes son
 * la defensa contra puntajes inflados.
 */
export function computeGameStars(
  score: number,
  maxPerSession: number,
  earnedRecently: number,
): number {
  const clampedScore = Math.min(100, Math.max(0, score));
  const fromScore = Math.round((clampedScore / 100) * maxPerSession);
  const remaining = Math.max(0, DAILY_GAME_STAR_CAP - earnedRecently);
  return Math.min(fromScore, remaining);
}
