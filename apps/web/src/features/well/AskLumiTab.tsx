import { type FormEvent, useState } from 'react';
import { useAskLumi, useLumiQuestions, useLumiStatus } from '@/api/hooks';
import type { LumiQuestion } from '@/api/types';
import logo from '@/assets/brand/logo.webp';
import { useCurrentChild } from '@/auth/useActiveChild';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';

const MAX_LENGTH = 300;

/**
 * Pedir un deseo = hacerle una pregunta a Lumi. Toda la seguridad (filtros,
 * límites, permiso de los padres) vive en la API; aquí solo se muestra.
 */
export function AskLumiTab({ onSpend }: { onSpend: () => void }) {
  const { childId, data: child } = useCurrentChild();
  const status = useLumiStatus(childId);
  const history = useLumiQuestions(childId);
  const ask = useAskLumi(childId);
  const [question, setQuestion] = useState('');

  if (status.isLoading) return <Spinner />;
  if (status.error)
    return <ErrorMessage error={status.error} onRetry={() => void status.refetch()} />;
  const lumi = status.data;
  if (!lumi) return null;

  if (!lumi.enabled) {
    return (
      <Notice emoji="🔒">
        Para hablar con Lumi, pídele a tus papás que lo activen en la{' '}
        <strong>Zona de padres</strong>.
      </Notice>
    );
  }
  if (!lumi.available) {
    return <Notice emoji="😴">Lumi está descansando. ¡Vuelve más tarde!</Notice>;
  }

  const stars = child?.stars ?? 0;
  const canAsk = stars >= lumi.cost && lumi.remainingToday > 0 && question.trim().length >= 3;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    ask.mutate(question, {
      onSuccess: (result) => {
        setQuestion('');
        if (result.starsSpent > 0) onSpend();
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-xl"
      >
        <label htmlFor="lumi-question" className="text-xl font-extrabold text-brand-700">
          ¿Qué te gustaría saber?
        </label>
        <textarea
          id="lumi-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="Ej: ¿Por qué el cielo es azul?"
          className="w-full rounded-2xl border-2 border-brand-200 p-3 text-lg focus:border-brand-500 focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink/70">
          <span>
            {question.length}/{MAX_LENGTH} · Te quedan {lumi.remainingToday} preguntas hoy
          </span>
          <span>🛡️ No escribas tu dirección, teléfono ni contraseñas</span>
        </div>
        {ask.error && <ErrorMessage error={ask.error} />}
        <Button type="submit" variant="sun" loading={ask.isPending} disabled={!canAsk}>
          {stars < lumi.cost
            ? `Te faltan ${lumi.cost - stars} ⭐`
            : `Lanzar ⭐ ${lumi.cost} y preguntar`}
        </Button>
      </form>

      {ask.data && <Answer item={ask.data} highlight />}

      {history.data && history.data.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="self-start rounded-full bg-white/90 px-4 py-1 text-2xl font-extrabold text-brand-700">
            Mis preguntas
          </h2>
          {history.data
            .filter((item) => item.id !== ask.data?.id)
            .map((item) => (
              <Answer key={item.id} item={item} />
            ))}
        </section>
      )}
    </div>
  );
}

function Answer({ item, highlight = false }: { item: LumiQuestion; highlight?: boolean }) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-lg ${highlight ? 'animate-pop ring-4 ring-sun' : ''}`}
      aria-live={highlight ? 'polite' : undefined}
    >
      <p className="self-end rounded-2xl rounded-br-sm bg-brand-100 px-4 py-2 font-semibold">
        {item.question}
      </p>
      <div className="flex items-start gap-3">
        <img
          src={logo}
          alt="Lumi"
          className="size-12 shrink-0 rounded-full bg-brand-50 object-contain"
        />
        <p className="rounded-2xl rounded-tl-sm bg-sun/40 px-4 py-2 whitespace-pre-line">
          {item.answer}
        </p>
      </div>
    </article>
  );
}

function Notice({ emoji, children }: { emoji: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-8 text-center text-lg shadow-xl">
      <span className="text-5xl" aria-hidden>
        {emoji}
      </span>
      <p>{children}</p>
    </div>
  );
}
