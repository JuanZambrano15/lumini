import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/Button';
import { errorMessage } from '@/lib/errors';
import { TextField } from '@/components/Field';
import { AuthLayout } from './AuthLayout';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setSubmitting(true);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? '/perfiles', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <Button type="submit" loading={submitting}>
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-bold text-brand-700 underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}
