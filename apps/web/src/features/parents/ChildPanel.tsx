import { useState } from 'react';
import { useChildSettings, useChildSummary, useDeleteChild, useLumiQuestions } from '@/api/hooks';
import type { Child, LumiQuestion } from '@/api/types';
import { useActiveChild } from '@/auth/useActiveChild';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/format';

export function ChildPanel({ child }: { child: Child }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SummaryCard child={child} />
      <LumiPanel child={child} />
      <DangerZone child={child} />
    </div>
  );
}

function SummaryCard({ child }: { child: Child }) {
  const { data, isLoading, error, refetch } = useChildSummary(child.id, true);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-2xl font-extrabold text-brand-700">Progreso de {child.name}</h2>
      {isLoading && <Spinner />}
      {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}
      {data && (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Estrellas" value={`⭐ ${data.stars}`} />
            <Stat label="Actividades" value={data.activityAttempts} />
            <Stat
              label="Promedio"
              value={data.averageScore === null ? '—' : `${data.averageScore}%`}
            />
            <Stat label="Partidas" value={data.gamesPlayed} />
          </dl>
          {data.flaggedQuestions > 0 && (
            <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              ⚠️ {data.flaggedQuestions} de {data.questions} preguntas a Lumi fueron bloqueadas o
              tocaban temas delicados. Revísalas abajo.
            </p>
          )}

          <h3 className="mt-6 mb-2 text-lg font-extrabold">Avance por tema</h3>
          <ul className="space-y-3">
            {data.topics.map((topic) => {
              const percent = topic.totalActivities
                ? Math.round((topic.completedActivities / topic.totalActivities) * 100)
                : 0;
              return (
                <li key={topic.id}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{topic.title}</span>
                    <span>
                      {topic.completedActivities}/{topic.totalActivities}
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-brand-100"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={topic.title}
                  >
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-6 mb-2 text-lg font-extrabold">Últimos movimientos</h3>
          {data.recentTransactions.length === 0 ? (
            <p className="text-ink/70">Todavía no hay actividad.</p>
          ) : (
            <ul className="divide-y divide-brand-100 text-sm">
              {data.recentTransactions.map((movement) => (
                <li key={movement.id} className="flex justify-between gap-2 py-2">
                  <span>
                    {movement.description}
                    <span className="block text-ink/50">{formatDate(movement.createdAt)}</span>
                  </span>
                  <span
                    className={`font-bold ${movement.amount > 0 ? 'text-green-600' : 'text-red-500'}`}
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
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-brand-50 p-3 text-center">
      <dt className="text-xs font-bold text-ink/60 uppercase">{label}</dt>
      <dd className="font-display text-2xl font-extrabold text-brand-700">{value}</dd>
    </div>
  );
}

const statusBadge: Record<LumiQuestion['status'], { label: string; className: string }> = {
  ANSWERED: { label: 'Respondida', className: 'bg-green-100 text-green-800' },
  BLOCKED: { label: 'Bloqueada por filtro', className: 'bg-amber-100 text-amber-800' },
  REDIRECTED: { label: 'Tema delicado', className: 'bg-red-100 text-red-800' },
};

const reasonLabel: Record<string, string> = {
  personal_info: 'datos personales',
  inappropriate: 'lenguaje inapropiado',
  too_short: 'muy corta',
  too_long: 'muy larga',
  violence: 'violencia',
  sexual: 'contenido sexual',
  self_harm: 'autolesión',
  dangerous: 'actividad peligrosa',
  hate: 'odio o discriminación',
  other_unsafe: 'otro tema no apto',
};

/** Control de Lumi (IA): activar/desactivar y revisar todo lo que el niño preguntó. */
function LumiPanel({ child }: { child: Child }) {
  const settings = useChildSettings(child.id);
  const { data: questions, isLoading, error } = useLumiQuestions(child.id);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="mb-1 text-2xl font-extrabold text-brand-700">Preguntas a Lumi (IA)</h2>
      <p className="mb-4 text-sm text-ink/70">
        En el pozo de los deseos, {child.name} puede gastar estrellas para hacerle preguntas a Lumi,
        un asistente con inteligencia artificial. Las preguntas pasan por filtros de seguridad y
        aquí puedes revisarlas todas.
      </p>

      <label className="mb-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-brand-50 p-4">
        <span className="font-bold">Permitir preguntas a Lumi</span>
        <input
          type="checkbox"
          role="switch"
          className="size-6 accent-brand-600"
          checked={child.aiEnabled}
          disabled={settings.isPending}
          onChange={(event) => settings.mutate({ aiEnabled: event.target.checked })}
        />
      </label>
      {settings.error && <ErrorMessage error={settings.error} />}

      {isLoading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {questions && questions.length === 0 && (
        <p className="text-ink/70">Todavía no ha hecho preguntas.</p>
      )}
      <ul className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto">
        {questions?.map((item) => {
          const badge = statusBadge[item.status];
          return (
            <li key={item.id} className="rounded-2xl border border-brand-100 p-3 text-sm">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge.className}`}>
                  {badge.label}
                  {item.reason && ` · ${reasonLabel[item.reason] ?? item.reason}`}
                </span>
                <span className="text-ink/50">{formatDate(item.createdAt)}</span>
              </div>
              <p className="font-bold">🧒 {item.question}</p>
              <p className="mt-1 text-ink/80">💡 {item.answer}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DangerZone({ child }: { child: Child }) {
  const deleteChild = useDeleteChild();
  const { activeChildId, selectChild } = useActiveChild();
  const [confirming, setConfirming] = useState(false);

  function remove() {
    deleteChild.mutate(child.id, {
      onSuccess: () => {
        if (activeChildId === child.id) selectChild(null);
        setConfirming(false);
      },
    });
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl lg:col-span-2">
      <h2 className="mb-2 text-xl font-extrabold text-red-600">Eliminar perfil</h2>
      <p className="mb-4 text-sm text-ink/70">
        Se borrará el perfil de {child.name} con todo su progreso, estrellas y deseos. No se puede
        deshacer.
      </p>
      <Button variant="danger" onClick={() => setConfirming(true)}>
        Eliminar a {child.name}
      </Button>
      <Modal
        title={`¿Eliminar a ${child.name}?`}
        open={confirming}
        onClose={() => setConfirming(false)}
      >
        <p className="mb-4">Esta acción borra todo su progreso y no se puede deshacer.</p>
        {deleteChild.error && <ErrorMessage error={deleteChild.error} />}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            Cancelar
          </Button>
          <Button variant="danger" loading={deleteChild.isPending} onClick={remove}>
            Sí, eliminar
          </Button>
        </div>
      </Modal>
    </section>
  );
}
