import { type FormEvent, useState } from 'react';
import { api } from '@/api/client';
import type { ParentSession } from '@/api/types';
import { useParentMode } from '@/auth/useParentMode';
import { Button } from '@/components/Button';
import { errorMessage } from '@/lib/errors';
import { TextField } from '@/components/Field';

export function ChangePinForm() {
  const { unlock } = useParentMode();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setStatus(null);
    try {
      const result = await api<ParentSession>('/parent/pin', {
        method: 'PUT',
        body: { currentPin: String(form.get('currentPin')), pin: String(form.get('newPin')) },
      });
      unlock(result.parentToken, result.expiresIn);
      formElement.reset();
      setStatus({ ok: true, message: 'PIN actualizado' });
    } catch (err) {
      setStatus({ ok: false, message: errorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-extrabold text-brand-700">Cambiar PIN</h2>
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="grid gap-3 sm:grid-cols-3 sm:items-end"
      >
        <TextField
          label="PIN actual"
          name="currentPin"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          required
        />
        <TextField
          label="Nuevo PIN"
          name="newPin"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          required
        />
        <Button type="submit" loading={submitting}>
          Guardar
        </Button>
      </form>
      {status && (
        <p
          role="status"
          className={`mt-3 text-sm font-semibold ${status.ok ? 'text-green-700' : 'text-red-700'}`}
        >
          {status.message}
        </p>
      )}
    </section>
  );
}
