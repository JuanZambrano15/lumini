import { useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { api } from '@/api/client';
import { queryKeys } from '@/api/hooks';
import type { ParentSession } from '@/api/types';
import { useAuth } from '@/auth/useAuth';
import { useParentMode } from '@/auth/useParentMode';
import { Button } from '@/components/Button';
import { errorMessage } from '@/lib/errors';
import { TextField } from '@/components/Field';

/**
 * Puerta de la zona de padres. La primera vez crea el PIN; después lo pide.
 * La verificación ocurre en el servidor (antes se comparaba en el navegador).
 */
export function ParentGate() {
  const { user } = useAuth();
  const { unlock } = useParentMode();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSetup = !user?.hasParentPin;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pin = String(form.get('pin'));

    if (isSetup && pin !== String(form.get('confirm'))) {
      setError('Los PIN no coinciden');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = isSetup
        ? await api<ParentSession>('/parent/pin', { method: 'PUT', body: { pin } })
        : await api<ParentSession>('/parent/session', { method: 'POST', body: { pin } });
      unlock(result.parentToken, result.expiresIn);
      if (isSetup) await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="mx-auto flex max-w-sm animate-pop flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl"
    >
      <h2 className="text-center text-2xl font-extrabold text-brand-700">
        {isSetup ? 'Crea tu PIN de padres' : 'Ingresa tu PIN de padres'}
      </h2>
      <p className="text-center text-sm text-ink/70">
        {isSetup
          ? 'Con este PIN solo los adultos podrán ver el progreso y gestionar los deseos.'
          : 'Esta zona es solo para adultos.'}
      </p>
      <TextField
        label="PIN (4 a 6 dígitos)"
        name="pin"
        type="password"
        inputMode="numeric"
        pattern="\d{4,6}"
        autoComplete="off"
        required
        autoFocus
      />
      {isSetup && (
        <TextField
          label="Repite el PIN"
          name="confirm"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          autoComplete="off"
          required
        />
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" loading={submitting}>
        {isSetup ? 'Guardar PIN' : 'Entrar'}
      </Button>
    </form>
  );
}
