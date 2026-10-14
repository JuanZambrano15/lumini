import { type ReactNode, useMemo, useState } from 'react';
import { useChildSettings, useChildSummary, useDeleteChild, useLumiQuestions } from '@/api/hooks';
import type { Child, ChildSummary, LumiQuestion } from '@/api/types';
import { useActiveChild } from '@/auth/useActiveChild';
import diplomaIcon from '@/assets/icons/diploma.webp';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Modal } from '@/components/Modal';
import { formatDate } from '@/lib/format';

export type ParentSection =
  'inicio' | 'sesiones' | 'evolucion' | 'recompensas' | 'diplomas' | 'pozo';

/** Contenido de cada opción del menú lateral de la web de padres. */
export function ChildPanel({ child, section }: { child: Child; section: ParentSection }) {
  const summary = useChildSummary(child.id, section !== 'pozo');

  if (section === 'pozo') return <LumiPanel child={child} />;
  if (summary.isLoading) return <Spinner />;
  if (summary.error)
    return <ErrorMessage error={summary.error} onRetry={() => void summary.refetch()} />;
  if (!summary.data) return null;

  switch (section) {
    case 'inicio':
      return (
        <div className="flex flex-col gap-6">
          <Card title={`Resumen de ${child.name}`}>
            <Stats data={summary.data} />
            {summary.data.flaggedQuestions > 0 && (
              <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-medium text-amber-900">
                ⚠️ {summary.data.flaggedQuestions} de {summary.data.questions} preguntas a Lumi
                fueron bloqueadas o tocaban temas delicados. Revísalas en “Pozo”.
              </p>
            )}
          </Card>
          <DangerZone child={child} />
        </div>
      );
    case 'sesiones':
      return <Calendar data={summary.data} />;
    case 'evolucion':
      return (
        <Card title="Evolución">
          <Stats data={summary.data} />
          <TopicProgress data={summary.data} />
        </Card>
      );
    case 'recompensas':
      return <Rewards data={summary.data} />;
    case 'diplomas':
      return <Diplomas data={summary.data} />;
  }
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="w-full rounded-[36px] bg-white p-6 shadow-[0_12px_40px_rgba(61,36,112,0.18)] sm:p-8">
      <h2 className="mb-4 text-2xl font-semibold text-brand-700">{title}</h2>
      {children}
    </section>
  );
}

function Stats({ data }: { data: ChildSummary }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Estrellas" value={`⭐ ${data.stars}`} />
      <Stat label="Actividades" value={data.activityAttempts} />
      <Stat label="Promedio" value={data.averageScore === null ? '—' : `${data.averageScore}%`} />
      <Stat label="Partidas" value={data.gamesPlayed} />
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-parents-sub p-3 text-center">
      <dt className="text-sm font-medium text-ink/70">{label}</dt>
      <dd className="text-2xl font-semibold text-brand-700">{value}</dd>
    </div>
  );
}

function TopicProgress({ data }: { data: ChildSummary }) {
  return (
    <>
      <h3 className="mt-6 mb-2 text-lg font-semibold">Avance por tema</h3>
      <ul className="space-y-3">
        {data.topics.map((topic) => {
          const percent = topic.totalActivities
            ? Math.round((topic.completedActivities / topic.totalActivities) * 100)
            : 0;
          return (
            <li key={topic.id}>
              <div className="flex justify-between gap-2 text-sm font-medium">
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
    </>
  );
}

// ─── Sesiones: calendario del Figma ──────────────────────────────────────────

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const monthFormatter = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });
const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/**
 * Calendario con la semana actual resaltada (franja lila del Figma), hoy con
 * círculo negro y los días con actividad con círculo gris. La actividad sale de
 * los últimos movimientos de estrellas, que es lo que expone la API.
 */
function Calendar({ data }: { data: ChildSummary }) {
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const activeDays = useMemo(
    () => new Set(data.recentTransactions.map((movement) => dayKey(new Date(movement.createdAt)))),
    [data.recentTransactions],
  );

  const start = new Date(month);
  start.setDate(1 - month.getDay());
  const weeks = Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + day);
      return date;
    }),
  ).filter((week) => week.some((date) => date.getMonth() === month.getMonth()));
  const isThisWeek = (week: Date[]) => week.some((date) => dayKey(date) === dayKey(today));
  const shift = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <section
      aria-label="Calendario de sesiones"
      className="mx-auto w-full max-w-[480px] rounded-[36px] bg-white px-4 pt-2 pb-8 shadow-[0_12px_40px_rgba(61,36,112,0.22)] sm:px-6"
    >
      <div className="mx-auto mt-2 flex h-[52px] max-w-[382px] items-center justify-between rounded-full border border-[#f1eaf3] px-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Mes anterior"
          className="grid size-10 place-items-center rounded-full text-2xl text-[#5c4b5a] hover:bg-brand-50"
        >
          ‹
        </button>
        <h2 className="text-lg font-medium text-ink uppercase">{monthFormatter.format(month)}</h2>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Mes siguiente"
          className="grid size-10 place-items-center rounded-full text-2xl text-[#5c4b5a] hover:bg-brand-50"
        >
          ›
        </button>
      </div>

      <table className="mt-4 w-full table-fixed text-center">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day} scope="col" className="pb-2 text-base font-semibold text-ink">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => {
            const highlighted = isThisWeek(week);
            return (
              <tr key={dayKey(week[0])} className={highlighted ? 'bg-week' : ''}>
                {week.map((date, index) => {
                  const inMonth = date.getMonth() === month.getMonth();
                  const isToday = dayKey(date) === dayKey(today);
                  const active = activeDays.has(dayKey(date));
                  return (
                    <td
                      key={dayKey(date)}
                      className={`h-12 ${highlighted && index === 0 ? 'rounded-l-full' : ''} ${highlighted && index === 6 ? 'rounded-r-full' : ''}`}
                    >
                      <span
                        className={`mx-auto grid size-9 place-items-center rounded-full text-lg ${
                          isToday
                            ? 'border-2 border-ink bg-white font-semibold text-ink'
                            : active
                              ? 'border-2 border-[#9a8f98] bg-white text-ink'
                              : highlighted
                                ? 'font-semibold text-[#4b2a6b]'
                                : inMonth
                                  ? 'text-[#7a6873]'
                                  : 'text-[#b9adb5]'
                        }`}
                        aria-label={`${date.getDate()}${isToday ? ', hoy' : ''}${active ? ', con actividad' : ''}`}
                      >
                        {date.getDate()}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-ink/80">
        <span>
          <span className="mr-1 inline-block size-3 rounded-full border-2 border-ink align-middle" />
          Hoy
        </span>
        <span>
          <span className="mr-1 inline-block size-3 rounded-full border-2 border-[#9a8f98] align-middle" />
          Día con actividad
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-5 rounded-full bg-week align-middle" />
          Esta semana
        </span>
      </p>
    </section>
  );
}

// ─── Recompensas y diplomas ─────────────────────────────────────────────────

function Rewards({ data }: { data: ChildSummary }) {
  return (
    <Card title="Recompensas">
      <p className="mb-4 text-lg">
        Estrellas disponibles:{' '}
        <span className="rounded-full bg-sun px-3 py-0.5 font-semibold">⭐ {data.stars}</span>
      </p>
      <h3 className="mb-2 text-lg font-semibold">Últimos movimientos</h3>
      {data.recentTransactions.length === 0 ? (
        <p className="text-ink/70">Todavía no hay actividad.</p>
      ) : (
        <ul className="divide-y divide-brand-100">
          {data.recentTransactions.map((movement) => (
            <li key={movement.id} className="flex justify-between gap-2 py-2">
              <span>
                {movement.description}
                <span className="block text-sm text-ink/60">{formatDate(movement.createdAt)}</span>
              </span>
              <span
                className={`font-semibold ${movement.amount > 0 ? 'text-green-700' : 'text-red-600'}`}
              >
                {movement.amount > 0 ? '+' : ''}
                {movement.amount} ⭐
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Diplomas({ data }: { data: ChildSummary }) {
  return (
    <Card title="Diplomas">
      <p className="mb-4 text-ink/80">
        Se gana un diploma al completar todas las actividades de un tema.
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {data.topics.map((topic) => {
          const earned =
            topic.totalActivities > 0 && topic.completedActivities >= topic.totalActivities;
          return (
            <li
              key={topic.id}
              className={`flex flex-col items-center gap-2 rounded-3xl p-4 text-center ${earned ? 'bg-parents-sub' : 'bg-brand-50 opacity-70'}`}
            >
              <img src={diplomaIcon} alt="" className={`h-12 ${earned ? '' : 'grayscale'}`} />
              <span className="font-medium">{topic.title}</span>
              <span className="text-sm text-ink/70">
                {earned
                  ? '¡Diploma ganado!'
                  : `${topic.completedActivities}/${topic.totalActivities} actividades`}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// ─── Pozo: preguntas a Lumi (IA) ─────────────────────────────────────────────

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
    <Card title="Pozo de los deseos · Preguntas a Lumi">
      <p className="mb-4 text-ink/80">
        En el pozo de los deseos, {child.name} puede gastar estrellas para hacerle preguntas a Lumi,
        un asistente con inteligencia artificial. Las preguntas pasan por filtros de seguridad y
        aquí puedes revisarlas todas.
      </p>

      <label className="mb-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-parents-sub p-4">
        <span className="font-semibold">Permitir preguntas a Lumi</span>
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
            <li key={item.id} className="rounded-2xl border border-brand-100 p-3">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}
                  {item.reason && ` · ${reasonLabel[item.reason] ?? item.reason}`}
                </span>
                <span className="text-sm text-ink/60">{formatDate(item.createdAt)}</span>
              </div>
              <p className="font-semibold">🧒 {item.question}</p>
              <p className="mt-1 text-ink/80">💡 {item.answer}</p>
            </li>
          );
        })}
      </ul>
    </Card>
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
    <section className="w-full rounded-[36px] bg-white p-6 shadow-[0_12px_40px_rgba(61,36,112,0.18)] sm:p-8">
      <h2 className="mb-2 text-xl font-semibold text-red-700">Eliminar perfil</h2>
      <p className="mb-4 text-ink/80">
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
