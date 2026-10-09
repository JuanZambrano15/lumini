import { Navigate, Outlet, useLocation } from 'react-router';
import { useActiveChild } from '@/auth/useActiveChild';
import { FullScreenLoader } from '@/components/Feedback';
import { useAuth } from './useAuth';

/** Rutas que exigen sesión iniciada. */
export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Rutas del mundo infantil: exigen haber elegido un perfil. */
export function RequireChild() {
  const { activeChildId } = useActiveChild();
  if (!activeChildId) return <Navigate to="/perfiles" replace />;
  return <Outlet />;
}

/** Login y registro: si ya hay sesión, no tiene sentido mostrarlos. */
export function GuestOnly() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (user) return <Navigate to="/perfiles" replace />;
  return <Outlet />;
}
