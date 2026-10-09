import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/Button';
import { errorMessage } from '@/lib/errors';
import { TextField } from '@/components/Field';
import { AuthLayout } from './AuthLayout';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));

    if (password !== String(form.get('confirm'))) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await register(String(form.get('email')), password, String(form.get('name')).trim());
      navigate('/perfiles', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Nombre (opcional)" name="name" autoComplete="name" maxLength={80} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hint="Mínimo 8 caracteres"
          required
        />
        <TextField
          label="Repite la contraseña"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" loading={submitting}>
          Crear cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/ingresar" className="font-bold text-brand-700 underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
