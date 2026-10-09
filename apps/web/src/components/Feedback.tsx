import { errorMessage } from '@/lib/errors';

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 p-6 text-brand-700">
      <span className="size-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <Spinner />
    </div>
  );
}

export function ErrorMessage({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl bg-white/90 p-4 text-center text-red-700 shadow"
    >
      <p className="font-semibold">{errorMessage(error)}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-red-100 px-4 py-1 font-bold hover:bg-red-200"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
