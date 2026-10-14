import { type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useChildren } from '@/api/hooks';
import type { Child } from '@/api/types';
import { useActiveChild } from '@/auth/useActiveChild';
import { useAuth } from '@/auth/useAuth';
import background from '@/assets/scenes/perfiles.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { ChevronDownIcon, ExitIcon, HelpIcon, PencilIcon, PlusIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { Modal } from '@/components/Modal';
import { ChildFormModal } from './ChildFormModal';

const MAX_CHILDREN = 3;

type ModalState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; child: Child };

/** Pantalla "pantallas" del Figma: cuenta arriba y tres espacios para perfiles. */
export function ProfilesPage() {
  const { user, logout } = useAuth();
  const { activeChildId, selectChild } = useActiveChild();
  const navigate = useNavigate();
  const { data: children, isLoading, error, refetch } = useChildren();
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const [editing, setEditing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  function play(child: Child) {
    selectChild(child.id);
    navigate('/mundo');
  }

  async function handleLogout() {
    selectChild(null);
    await logout();
    navigate('/', { replace: true });
  }

  const emptySlots = children ? Math.max(0, MAX_CHILDREN - children.length) : 0;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white">
      {/* Fondo de garabatos del Figma, aclarado para que no compita con las tarjetas. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(${background})` }}
      />

      <header className="relative z-10 bg-mint">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-2 xl:h-[137px] xl:flex-nowrap xl:gap-x-0 xl:py-0 xl:pr-[124px] xl:pl-[264px]">
          <Logo className="h-20 w-auto xl:h-[137px]" to="/perfiles" />

          <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 xl:ml-[180px] xl:flex-nowrap">
            <AccountMenu
              name={user?.name || 'Mi cuenta'}
              email={user?.email ?? ''}
              onLogout={() => void handleLogout()}
            />
            <span aria-hidden className="hidden h-[56px] w-px bg-mint-line/60 sm:block" />
            <div className="flex items-center gap-2">
              <IconButton
                label={editing ? 'Terminar de editar' : 'Editar perfiles'}
                pressed={editing}
                onClick={() => setEditing((value) => !value)}
              >
                <PencilIcon className="size-7" />
              </IconButton>
              <IconButton label="Ayuda" onClick={() => setHelpOpen(true)}>
                <HelpIcon className="size-7" />
              </IconButton>
              <IconButton label="Cerrar sesión" onClick={() => void handleLogout()}>
                <ExitIcon className="size-7" />
              </IconButton>
            </div>
          </div>

          <Link
            to="/padres"
            className="rounded-[14px] border border-ink bg-orchid px-6 py-2.5 text-lg tracking-[0.06em] whitespace-nowrap text-ink transition hover:brightness-95 xl:ml-[25px] xl:w-[195px] xl:px-0 xl:text-center"
          >
            Web de padres
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pt-8 pb-16 xl:pt-[34px]">
        <h1 className="sr-only">¿Quién va a aprender hoy?</h1>
        {editing && (
          <p className="mx-auto mb-4 w-fit rounded-full bg-white px-5 py-2 font-semibold text-ink shadow">
            ✏️ Toca un perfil para editarlo
          </p>
        )}

        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}

        {children && (
          <ul className="flex flex-wrap justify-center gap-x-[50px] gap-y-8 xl:-ml-[14px]">
            {children.map((child) => (
              <ProfileCard
                key={child.id}
                child={child}
                active={child.id === activeChildId}
                editing={editing}
                onPlay={() => play(child)}
                onEdit={() => setModal({ mode: 'edit', child })}
              />
            ))}
            {Array.from({ length: emptySlots }, (_, index) => (
              <li key={`vacio-${index}`}>
                <Card>
                  <button
                    type="button"
                    onClick={() => setModal({ mode: 'create' })}
                    aria-label="Añadir un perfil"
                    className="group grid flex-1 place-items-center"
                  >
                    <span className="grid size-[129px] place-items-center rounded-full border border-ink transition group-hover:bg-lilac/50">
                      <PlusIcon className="size-[96px] text-ink" />
                    </span>
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>

      <ChildFormModal
        open={modal.mode !== 'closed'}
        child={modal.mode === 'edit' ? modal.child : undefined}
        onClose={() => setModal({ mode: 'closed' })}
      />

      <Modal title="¿Cómo funciona?" open={helpOpen} onClose={() => setHelpOpen(false)}>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-lg">
          <li>Toca el círculo con el + para crear el perfil de tu hijo o hija (hasta 3).</li>
          <li>Toca “Entrar” para que empiece a aprender y jugar.</li>
          <li>Con el lápiz ✏️ cambias el nombre o el personaje de un perfil.</li>
          <li>En “Web de padres” ves su progreso. Se protege con un PIN.</li>
        </ol>
      </Modal>
    </div>
  );
}

/** Tarjeta del Figma: pestaña lila arriba y cuerpo blanco con sombra. */
function Card({ tab, children }: { tab?: string; children: ReactNode }) {
  return (
    <div className="flex h-[321px] w-[253px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(46,42,71,0.18)]">
      <div className="grid h-[40px] shrink-0 place-items-center rounded-t-2xl border border-lilac-line bg-lilac text-[17px] font-medium tracking-[0.04em] text-lilac-ink">
        {tab}
      </div>
      {children}
    </div>
  );
}

interface ProfileCardProps {
  child: Child;
  active: boolean;
  editing: boolean;
  onPlay: () => void;
  onEdit: () => void;
}

function ProfileCard({ child, active, editing, onPlay, onEdit }: ProfileCardProps) {
  return (
    <li>
      <Card tab={active ? 'ACTIVA' : undefined}>
        <div className="flex flex-1 flex-col items-center px-6 pt-3 pb-5">
          <div className="grid size-[110px] place-items-center overflow-hidden rounded-full border-2 border-cloud-line bg-cloud">
            <ChildAvatar child={child} className="h-[92px] w-[60px]" />
          </div>
          <p className="mt-2 max-w-full truncate text-[22px] font-medium text-[#3f3a52]">
            {child.name}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] font-medium text-[#3f3a52]">
            Estrellas
            <span className="rounded-full bg-sun px-2 text-sm font-semibold text-ink">
              ⭐ {child.stars}
            </span>
          </p>
          <button
            type="button"
            onClick={editing ? onEdit : onPlay}
            className="mt-auto h-[64px] w-full rounded-xl border border-cloud-line bg-[#fbfbfd] text-[22px] font-medium text-[#3f3a52] transition hover:border-brand-400 hover:bg-brand-50"
          >
            {editing ? '✏️ Editar' : 'Entrar'}
          </button>
        </div>
      </Card>
    </li>
  );
}

function AccountMenu({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  return (
    <details className="group relative">
      <summary className="flex h-[54px] w-[290px] max-w-[80vw] cursor-pointer list-none items-center justify-between gap-3 rounded-xl border-2 border-mint-line px-5 hover:bg-white/40">
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[19px] font-semibold text-ink">{name}</span>
          <span className="block truncate text-[13px] text-ink/80">{email}</span>
        </span>
        <ChevronDownIcon className="size-6 shrink-0 transition group-open:rotate-180" />
      </summary>
      <div className="absolute top-full right-0 left-0 z-20 mt-2 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-mint-line/40">
        <Link to="/padres" className="px-5 py-3 font-medium hover:bg-mint/50">
          Web de padres
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="px-5 py-3 text-left font-medium hover:bg-mint/50"
        >
          Cerrar sesión
        </button>
      </div>
    </details>
  );
}

interface IconButtonProps {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function IconButton({ label, pressed, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`grid size-11 place-items-center rounded-xl text-ink transition hover:bg-white/50 ${pressed ? 'bg-white ring-2 ring-brand-500' : ''}`}
    >
      {children}
    </button>
  );
}
