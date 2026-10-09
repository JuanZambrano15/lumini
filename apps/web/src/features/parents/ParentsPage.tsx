import { useState } from 'react';
import { Link } from 'react-router';
import { useChildren } from '@/api/hooks';
import { useParentMode } from '@/auth/useParentMode';
import background from '@/assets/scenes/padres.webp';
import { AvatarImage } from '@/components/AvatarImage';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Logo } from '@/components/Logo';
import { ChildPanel } from './ChildPanel';
import { ChangePinForm } from './ChangePinForm';
import { ParentGate } from './ParentGate';

export function ParentsPage() {
  const { isUnlocked, lock } = useParentMode();

  return (
    <div
      className="min-h-dvh bg-brand-100 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <header className="flex items-center justify-between gap-2 bg-white/90 px-4 py-2 shadow">
        <Logo className="w-14" to="/perfiles" />
        <h1 className="text-xl font-extrabold text-brand-700 sm:text-2xl">Zona de padres</h1>
        <div className="flex gap-2">
          {isUnlocked && (
            <Button variant="ghost" onClick={lock}>
              🔒 Bloquear
            </Button>
          )}
          <Link
            to="/perfiles"
            className="rounded-full bg-brand-100 px-4 py-2 font-bold text-brand-700 hover:bg-brand-200"
          >
            Perfiles
          </Link>
        </div>
      </header>
      <main className="px-3 py-6 sm:px-6">{isUnlocked ? <Dashboard /> : <ParentGate />}</main>
    </div>
  );
}

function Dashboard() {
  const { data: children, isLoading, error, refetch } = useChildren();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = children?.find((child) => child.id === selectedId) ?? children?.[0];

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {children && children.length === 0 && (
        <p className="rounded-3xl bg-white p-6 text-center shadow">
          Aún no tienes perfiles.{' '}
          <Link to="/perfiles" className="font-bold underline">
            Crea el primero
          </Link>
          .
        </p>
      )}

      {children && children.length > 0 && (
        <div role="tablist" aria-label="Perfiles" className="flex flex-wrap gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              role="tab"
              aria-selected={selected?.id === child.id}
              onClick={() => setSelectedId(child.id)}
              className={`flex items-center gap-2 rounded-full py-1 pr-4 pl-1 font-bold shadow transition ${
                selected?.id === child.id ? 'bg-brand-600 text-white' : 'bg-white text-brand-700'
              }`}
            >
              <AvatarImage avatarId={child.avatarId} className="size-10 rounded-full bg-brand-50" />
              {child.name}
            </button>
          ))}
        </div>
      )}

      {selected && <ChildPanel key={selected.id} child={selected} />}

      <ChangePinForm />
    </div>
  );
}
