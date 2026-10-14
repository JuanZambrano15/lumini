import type { ReactNode } from 'react';
import loginBackground from '@/assets/scenes/login.webp';
import { Logo } from '@/components/Logo';

/** Login y registro ("login" del Figma): cielo con nubes y el botón lila al centro. */
export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-[#b0e0ef] bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <main className="flex w-full max-w-[420px] animate-pop flex-col items-center">
        <Logo className="w-28 drop-shadow" />
        <h1 className="mt-2 mb-5 text-center text-3xl font-bold text-ink">{title}</h1>
        <div className="w-full rounded-[28px] bg-white/75 p-6 shadow-[0_10px_40px_rgba(46,42,71,0.12)] backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
