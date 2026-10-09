import { useStars } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { formatDate } from '@/lib/format';

export function AchievementsPage() {
  const { childId } = useCurrentChild();
  const { data, isLoading, error, refetch } = useStars(childId);

  return (
    <ChildLayout title="Mis estrellas" backTo="/mundo">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}
        {data && (
          <>
            <p className="text-center font-display text-5xl font-extrabold text-brand-700">
              ⭐ {data.balance}
            </p>
            <p className="mb-6 text-center text-ink/70">estrellas para lanzar al pozo</p>
            {data.history.length === 0 ? (
              <p className="text-center">
                Completa actividades y juegos para ganar tus primeras estrellas.
              </p>
            ) : (
              <ul className="divide-y divide-brand-100">
                {data.history.map((movement) => (
                  <li key={movement.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-bold">{movement.description}</p>
                      <p className="text-sm text-ink/60">{formatDate(movement.createdAt)}</p>
                    </div>
                    <span
                      className={`font-display text-xl font-extrabold ${movement.amount > 0 ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {movement.amount > 0 ? '+' : ''}
                      {movement.amount} ⭐
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </ChildLayout>
  );
}
