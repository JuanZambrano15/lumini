import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useCurrentChild } from '@/auth/useActiveChild';
import { ChildAvatar } from './ChildAvatar';
import { StarBadge } from './StarBadge';

interface ChildLayoutProps {
  title: string;
  /** A dónde lleva el botón de volver. */
  backTo: string;
  backLabel?: string;
  background?: string;
  children: ReactNode;
}

/** Marco común de las pantallas infantiles: volver, avatar, nombre y estrellas. */
export function ChildLayout({
  title,
  backTo,
  backLabel = 'Volver',
  background,
  children,
}: ChildLayoutProps) {
  const { data: child } = useCurrentChild();

  return (
    <div
      className="min-h-dvh bg-brand-100 bg-cover bg-center bg-fixed"
      style={background ? { backgroundImage: `url(${background})` } : undefined}
    >
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 bg-white/85 px-3 py-2 shadow backdrop-blur sm:px-6">
        <Link
          to={backTo}
          className="shrink-0 rounded-full bg-brand-100 px-4 py-2 font-bold whitespace-nowrap text-brand-700 hover:bg-brand-200"
        >
          ← {backLabel}
        </Link>
        <h1 className="min-w-0 truncate text-lg font-extrabold text-brand-700 sm:text-2xl">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {child && (
            <>
              <ChildAvatar child={child} className="hidden h-11 w-9 sm:block" />
              <span className="hidden font-bold sm:inline">{child.name}</span>
              <StarBadge stars={child.stars} />
            </>
          )}
        </div>
      </header>
      <main className="px-3 py-4 sm:px-6">{children}</main>
    </div>
  );
}
