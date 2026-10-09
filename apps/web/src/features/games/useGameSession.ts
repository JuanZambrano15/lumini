import { useEffect, useRef } from 'react';
import { useRecordGameSession } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';

/** Mide la duración de la partida y la reporta a la API al terminar. */
export function useGameSession(slug: string) {
  const { childId } = useCurrentChild();
  const record = useRecordGameSession(childId, slug);
  const startedAt = useRef(0);

  // La primera partida empieza al abrir el juego.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  return {
    /** Reinicia el cronómetro para una nueva partida. */
    restart() {
      startedAt.current = Date.now();
      record.reset();
    },
    finish(score: number) {
      const durationSec = Math.min(3600, Math.round((Date.now() - startedAt.current) / 1000));
      record.mutate({ score: Math.round(score), durationSec });
    },
    starsEarned: record.data?.starsEarned,
    isSaving: record.isPending,
    error: record.error,
  };
}
