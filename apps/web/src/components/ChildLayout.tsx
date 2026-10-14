import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useCurrentChild } from '@/auth/useActiveChild';
import logo from '@/assets/brand/logo.webp';
import { ChildAvatar } from './ChildAvatar';
import { StarBadge } from './StarBadge';

interface ChildLayoutProps {
  title: string;
  /** A dónde lleva el botón "Salir". */
  backTo: string;
  backLabel?: string;
  background?: string;
  children: ReactNode;
}

/**
 * Marco de las pantallas infantiles que no tienen frame propio en el Figma
 * (tutorial, actividades, juegos, logros, pozo). Repite el lenguaje de las
 * escenas: logo arriba a la izquierda y "Salir" abajo a la derecha.
 */
export function ChildLayout({
  title,
  backTo,
  backLabel = 'Salir',
  background,
  children,
}: ChildLayoutProps) {
  const { data: child } = useCurrentChild();

  return (
    <div
      className="min-h-dvh bg-cloud bg-cover bg-center bg-fixed pb-20"
      style={background ? { backgroundImage: `url(${background})` } : undefined}
    >
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-3 py-2 sm:px-5">
        <Link to="/mundo" aria-label="Lumini, ir al mundo" className="shrink-0">
          <img src={logo} alt="" className="h-14 w-auto drop-shadow sm:h-16" />
        </Link>
        <h1 className="min-w-0 truncate rounded-full bg-white/90 px-5 py-1.5 text-lg font-bold text-ink shadow sm:text-2xl">
          {title}
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-white/90 py-1 pr-1 pl-1 shadow">
          {child && (
            <>
              <ChildAvatar child={child} className="hidden h-11 w-9 sm:block" />
              <StarBadge stars={child.stars} />
            </>
          )}
        </div>
      </header>
      <main className="px-3 py-4 sm:px-6">{children}</main>
      <Link
        to={backTo}
        className="fixed right-4 bottom-4 z-30 grid min-h-11 min-w-24 place-items-center rounded-full bg-salir px-5 font-medium text-ink shadow transition hover:brightness-95"
      >
        {backLabel}
      </Link>
    </div>
  );
}
