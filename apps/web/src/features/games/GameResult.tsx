import { Link } from 'react-router';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';

interface GameResultProps {
  title: string;
  detail: string;
  starsEarned?: number;
  isSaving: boolean;
  error: unknown;
  onPlayAgain: () => void;
}

/** Pantalla común de fin de partida. */
export function GameResult({
  title,
  detail,
  starsEarned,
  isSaving,
  error,
  onPlayAgain,
}: GameResultProps) {
  return (
    <div className="flex animate-pop flex-col items-center gap-4 text-center" aria-live="polite">
      <h2 className="text-4xl font-extrabold text-brand-700">{title}</h2>
      <p className="text-xl">{detail}</p>
      {isSaving && <Spinner label="Guardando…" />}
      {error ? <ErrorMessage error={error} /> : null}
      {starsEarned !== undefined && (
        <p className="rounded-full bg-sun px-5 py-2 font-display text-2xl font-extrabold">
          +{starsEarned} ⭐
        </p>
      )}
      {starsEarned === 0 && (
        <p className="text-ink/70">Ya alcanzaste el máximo de estrellas de hoy en este juego.</p>
      )}
      <div className="flex gap-3">
        <Button onClick={onPlayAgain}>Jugar otra vez</Button>
        <Link
          to="/juegos"
          className="inline-flex min-h-11 items-center rounded-full bg-white px-5 font-bold text-brand-700 ring-2 ring-brand-300"
        >
          Otros juegos
        </Link>
      </div>
    </div>
  );
}
