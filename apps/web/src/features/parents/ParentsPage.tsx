import { type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useChildren, useChildSummary } from '@/api/hooks';
import type { Child } from '@/api/types';
import { useAuth } from '@/auth/useAuth';
import { useParentMode } from '@/auth/useParentMode';
import calendarioIcon from '@/assets/icons/calendario.webp';
import diplomaIcon from '@/assets/icons/diploma.webp';
import estadisticasIcon from '@/assets/icons/estadisticas.webp';
import mochilaIcon from '@/assets/icons/mochila.webp';
import pozoIcon from '@/assets/icons/pozo.webp';
import regaloIcon from '@/assets/icons/regalo.webp';
import background from '@/assets/scenes/padres.webp';
import { AvatarImage } from '@/components/AvatarImage';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { ExitIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { ChangePinForm } from './ChangePinForm';
import { ChildPanel, type ParentSection } from './ChildPanel';
import { ParentGate } from './ParentGate';

/** "Web de padres" del Figma: menú lateral morado, nubes y el calendario al centro. */
export function ParentsPage() {
  const { isUnlocked } = useParentMode();

  return (
    <div
      className="min-h-dvh bg-[#d9eef6] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      {isUnlocked ? (
        <Dashboard />
      ) : (
        <div className="grid min-h-dvh place-items-center p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-4">
            <Logo className="w-24" to="/perfiles" />
            <ParentGate />
            <Link to="/perfiles" className="font-semibold text-brand-700 underline">
              Volver a los perfiles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const childSections: { key: ParentSection; label: string; icon: string }[] = [
  { key: 'sesiones', label: 'Sesiones', icon: calendarioIcon },
  { key: 'evolucion', label: 'Evolución', icon: estadisticasIcon },
  { key: 'recompensas', label: 'Recompensas', icon: regaloIcon },
  { key: 'diplomas', label: 'Diplomas', icon: diplomaIcon },
  { key: 'pozo', label: 'Pozo', icon: pozoIcon },
];

function Dashboard() {
  const { user } = useAuth();
  const { lock } = useParentMode();
  const navigate = useNavigate();
  const { data: children, isLoading, error, refetch } = useChildren();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [section, setSection] = useState<ParentSection>('sesiones');
  const index = Math.max(0, children?.findIndex((child) => child.id === selectedId) ?? 0);
  const selected = children?.[index];

  function exit() {
    lock();
    navigate('/perfiles');
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <nav
        aria-label="Web de padres"
        className="shrink-0 bg-gradient-to-b from-parents-from to-parents-to pb-2 md:min-h-dvh md:w-[228px] md:pt-[80px] md:pb-0"
      >
        <ul className="flex gap-1 overflow-x-auto px-2 pt-2 md:flex-col md:gap-0 md:overflow-visible md:p-0 [&>li]:shrink-0">
          <li>
            <SideButton
              selected={section === 'inicio'}
              onClick={() => setSection('inicio')}
              className="text-white"
            >
              <HouseIcon />
              Inicio
            </SideButton>
          </li>
          <li className="md:ml-3">
            <SideButton
              selected={section !== 'inicio'}
              onClick={() => setSection('sesiones')}
              className={section !== 'inicio' ? 'md:rounded-l-xl' : 'text-white'}
            >
              <img src={mochilaIcon} alt="" className="h-8 w-7 object-contain" />
              Alumnos
            </SideButton>
          </li>
          <li className="md:mt-3 md:ml-5 md:bg-parents-sub">
            <ul className="flex gap-1 md:flex-col md:gap-0 [&>li]:shrink-0">
              {childSections.map((item) => (
                <li key={item.key}>
                  <SideButton
                    selected={section === item.key}
                    onClick={() => setSection(item.key)}
                    className="md:text-[15px]"
                    sub
                  >
                    <img src={item.icon} alt="" className="h-7 w-8 object-contain" />
                    {item.label}
                  </SideButton>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <div className="relative flex-1 px-4 pt-4 pb-12 md:px-10">
        <TopBar
          initial={(user?.name || user?.email || '?').trim()[0]?.toUpperCase() ?? '?'}
          title={user?.email ?? ''}
          child={selected}
          onBell={() => setSection('pozo')}
          onExit={exit}
        />

        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}
        {children && children.length === 0 && (
          <p className="mx-auto mt-16 max-w-md rounded-3xl bg-white p-6 text-center shadow">
            Aún no tienes perfiles.{' '}
            <Link to="/perfiles" className="font-semibold underline">
              Crea el primero
            </Link>
            .
          </p>
        )}

        {children && selected && (
          <>
            <ChildSwitcher
              child={selected}
              onPrevious={index > 0 ? () => setSelectedId(children[index - 1].id) : undefined}
              onNext={
                index < children.length - 1
                  ? () => setSelectedId(children[index + 1].id)
                  : undefined
              }
            />
            <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-6">
              <ChildPanel key={`${selected.id}-${section}`} child={selected} section={section} />
              {section === 'inicio' && (
                <div className="w-full">
                  <ChangePinForm />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface SideButtonProps {
  selected: boolean;
  onClick: () => void;
  className?: string;
  sub?: boolean;
  children: ReactNode;
}

function SideButton({ selected, onClick, className = '', sub = false, children }: SideButtonProps) {
  return (
    <button
      type="button"
      aria-current={selected ? 'page' : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 font-semibold whitespace-nowrap transition md:rounded-none md:rounded-l-xl ${
        sub ? 'h-[51px] md:pl-2' : 'h-[61px]'
      } ${selected ? 'bg-white text-[#7149b8]' : sub ? 'text-[#7149b8] hover:bg-white/60' : 'hover:bg-white/15'} ${className}`}
    >
      {children}
    </button>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8" fill="currentColor" aria-hidden>
      <path d="M12 3 2 12h3v9h5v-6h4v6h5v-9h3L12 3Z" />
    </svg>
  );
}

interface TopBarProps {
  initial: string;
  title: string;
  child?: Child;
  onBell: () => void;
  onExit: () => void;
}

function TopBar({ initial, title, child, onBell, onExit }: TopBarProps) {
  return (
    <div className="flex items-center justify-end gap-5 md:absolute md:top-[22px] md:right-[110px]">
      {child ? <Bell child={child} onClick={onBell} /> : null}
      <span
        title={title}
        className="grid size-[48px] place-items-center rounded-full bg-[#178a73] text-xl font-bold text-white"
      >
        {initial}
      </span>
      <button
        type="button"
        onClick={onExit}
        aria-label="Salir de la web de padres"
        title="Salir"
        className="grid size-11 place-items-center rounded-xl text-[#8d60ff] hover:bg-white/60"
      >
        <ExitIcon className="size-8" />
      </button>
    </div>
  );
}

/** Campana: avisa si hay preguntas a Lumi bloqueadas o delicadas por revisar. */
function Bell({ child, onClick }: { child: Child; onClick: () => void }) {
  const { data } = useChildSummary(child.id, true);
  const pending = data?.flaggedQuestions ?? 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={pending ? `${pending} preguntas por revisar` : 'Sin avisos'}
      className="relative grid size-11 place-items-center rounded-xl text-[#8d60ff] hover:bg-white/60"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8a2.5 2.5 0 0 0 2.4 2Zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" />
      </svg>
      {pending > 0 && (
        <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-red-600 text-xs font-semibold text-white">
          {pending}
        </span>
      )}
    </button>
  );
}

interface ChildSwitcherProps {
  child: Child;
  onPrevious?: () => void;
  onNext?: () => void;
}

/** Selector del Figma: flechas a los lados del avatar y el nombre debajo. */
function ChildSwitcher({ child, onPrevious, onNext }: ChildSwitcherProps) {
  return (
    <div className="mx-auto mt-6 flex w-fit flex-col items-center md:mt-[64px]">
      <div className="flex items-center gap-2">
        <ArrowButton label="Alumno anterior" onClick={onPrevious}>
          ‹
        </ArrowButton>
        <div className="grid size-[72px] place-items-center overflow-hidden rounded-full border-2 border-[#b996e6] bg-[#d8c2f0]">
          <AvatarImage avatarId={child.avatarId} className="h-[64px] w-[44px] translate-y-1" />
        </div>
        <ArrowButton label="Alumno siguiente" onClick={onNext}>
          ›
        </ArrowButton>
      </div>
      <p className="mt-1 text-lg font-semibold text-[#6b4e9b] capitalize">{child.name}</p>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={!onClick}
      className="grid size-10 place-items-center rounded-full text-4xl leading-none text-[#9a8fd6] hover:bg-white/60 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
