import type { ReactNode } from 'react';
import authBackground from '@/assets/scenes/auth.webp';
import { Logo } from '@/components/Logo';

export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-brand-200 bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <main className="w-full max-w-md animate-pop rounded-3xl bg-white/95 p-6 shadow-2xl sm:p-8">
        <div className="mb-4 flex justify-center">
          <Logo className="w-24" />
        </div>
        <h1 className="mb-6 text-center text-3xl font-extrabold text-brand-700">{title}</h1>
        {children}
      </main>
    </div>
  );
}
