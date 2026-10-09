import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useChildren } from '@/api/hooks';
import type { Child } from '@/api/types';
import { useActiveChild } from '@/auth/useActiveChild';
import { useAuth } from '@/auth/useAuth';
import background from '@/assets/scenes/perfiles.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Logo } from '@/components/Logo';
import { StarBadge } from '@/components/StarBadge';
import { ChildFormModal } from './ChildFormModal';

const MAX_CHILDREN = 3;

type ModalState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; child: Child };

export function ProfilesPage() {
  const { user, logout } = useAuth();
  const { selectChild } = useActiveChild();
  const navigate = useNavigate();
  const { data: children, isLoading, error, refetch } = useChildren();
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

  function play(child: Child) {
    selectChild(child.id);
    navigate('/mundo');
  }

  async function handleLogout() {
    selectChild(null);
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div
      className="min-h-dvh bg-brand-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 bg-mint/90 px-4 py-2 shadow">
        <Logo className="w-14" to="/perfiles" />
        <span className="hidden font-bold sm:inline">{user?.name || user?.email}</span>
        <div className="flex gap-2">
          <Link
            to="/padres"
            className="rounded-full bg-white px-4 py-2 font-bold text-brand-700 ring-2 ring-brand-300 hover:bg-brand-50"
          >
            👨‍👩‍👧 Zona de padres
          </Link>
          <Button variant="ghost" onClick={() => void handleLogout()}>
            Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 rounded-3xl bg-white/80 py-3 text-center text-3xl font-extrabold text-brand-700 sm:text-4xl">
          ¿Quién va a aprender hoy?
        </h1>

        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}

        {children && (
          <ul className="flex flex-wrap justify-center gap-6">
            {children.map((child) => (
              <li key={child.id} className="relative w-44">
                <button
                  type="button"
                  onClick={() => play(child)}
                  className="flex w-full flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-xl ring-4 ring-brand-200 transition hover:-translate-y-1 hover:ring-brand-500"
                >
                  <ChildAvatar child={child} className="h-36 w-full" />
                  <span className="font-display text-2xl font-extrabold text-brand-700">
                    {child.name}
                  </span>
                  <StarBadge stars={child.stars} className="text-base" />
                </button>
                <button
                  type="button"
                  onClick={() => setModal({ mode: 'edit', child })}
                  aria-label={`Editar a ${child.name}`}
                  className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-brand-100 hover:bg-brand-200"
                >
                  ✏️
                </button>
              </li>
            ))}

            {children.length < MAX_CHILDREN && (
              <li className="w-44">
                <button
                  type="button"
                  onClick={() => setModal({ mode: 'create' })}
                  className="flex h-full min-h-60 w-full flex-col items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-brand-300 bg-white/80 p-4 font-bold text-brand-700 hover:bg-white"
                >
                  <span className="text-5xl" aria-hidden>
                    ➕
                  </span>
                  Añadir perfil
                </button>
              </li>
            )}
          </ul>
        )}
      </main>

      <ChildFormModal
        open={modal.mode !== 'closed'}
        child={modal.mode === 'edit' ? modal.child : undefined}
        onClose={() => setModal({ mode: 'closed' })}
      />
    </div>
  );
}
