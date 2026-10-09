import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useActivity, useSubmitAttempt } from '@/api/hooks';
import type { AttemptResult, Question } from '@/api/types';
import { useCurrentChild } from '@/auth/useActiveChild';
import { Button } from '@/components/Button';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage, Spinner } from '@/components/Feedback';

/**
 * Resuelve una actividad pregunta por pregunta. Las respuestas correctas no
 * llegan al navegador: al final se envían al servidor, que califica y otorga
 * las estrellas.
 */
export function ActivityPage() {
  const activityId = Number(useParams().activityId);
  const { childId } = useCurrentChild();
  const { data: activity, isLoading, error, refetch } = useActivity(activityId);
  const submit = useSubmitAttempt(childId, activityId);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = activity?.questions ?? [];
  const current = questions[answers.length];

  function choose(optionIndex: number) {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length === questions.length) submit.mutate(next);
  }

  function restart() {
    setAnswers([]);
    submit.reset();
  }

  return (
    <ChildLayout title={activity?.title ?? 'Actividad'} backTo="/estudio">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}

        {current && (
          <QuestionView
            key={answers.length}
            question={current}
            index={answers.length}
            total={questions.length}
            onChoose={choose}
          />
        )}

        {submit.isPending && <Spinner label="Revisando tus respuestas…" />}
        {submit.error && (
          <ErrorMessage error={submit.error} onRetry={() => submit.mutate(answers)} />
        )}
        {submit.data && activity && (
          <ResultView result={submit.data} questions={questions} onRetry={restart} />
        )}
      </section>
    </ChildLayout>
  );
}

function QuestionView({
  question,
  index,
  total,
  onChoose,
}: {
  question: Question;
  index: number;
  total: number;
  onChoose: (option: number) => void;
}) {
  return (
    <div className="flex animate-pop flex-col items-center gap-6 text-center">
      <div className="h-3 w-full overflow-hidden rounded-full bg-brand-100" aria-hidden>
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>
      <p className="font-bold text-brand-500">
        Pregunta {index + 1} de {total}
      </p>
      <h2 className="text-3xl font-extrabold">{question.prompt}</h2>
      {question.visual && (
        <p className="text-4xl leading-relaxed break-all sm:text-5xl">{question.visual}</p>
      )}
      <div className="grid w-full gap-3 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => (
          <button
            key={option}
            type="button"
            onClick={() => onChoose(optionIndex)}
            className="min-h-16 rounded-2xl bg-brand-100 px-4 py-3 text-2xl font-extrabold text-brand-900 shadow-[0_4px_0_var(--color-brand-300)] transition hover:bg-brand-200 active:translate-y-1 active:shadow-none"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultView({
  result,
  questions,
  onRetry,
}: {
  result: AttemptResult;
  questions: Question[];
  onRetry: () => void;
}) {
  const ratio = result.correct / result.total;
  const message = ratio === 1 ? '¡Perfecto!' : ratio >= 0.6 ? '¡Muy bien!' : '¡Sigue practicando!';

  return (
    <div className="flex animate-pop flex-col items-center gap-4 text-center" aria-live="polite">
      <p className="text-6xl" aria-hidden>
        {ratio === 1 ? '🏆' : ratio >= 0.6 ? '🎉' : '💪'}
      </p>
      <h2 className="text-4xl font-extrabold text-brand-700">{message}</h2>
      <p className="text-xl">
        Acertaste <strong>{result.correct}</strong> de {result.total}
      </p>
      <p className="rounded-full bg-sun px-5 py-2 font-display text-2xl font-extrabold">
        +{result.starsEarned} ⭐
      </p>
      {result.starsEarned === 0 && (
        <p className="text-ink/70">Supera tu récord para ganar más estrellas.</p>
      )}
      <ul className="w-full space-y-1 text-left">
        {questions.map((question, index) => (
          <li key={question.prompt} className="flex items-center gap-2">
            <span aria-hidden>{result.results[index] ? '✅' : '❌'}</span>
            <span className="sr-only">{result.results[index] ? 'Correcta:' : 'Incorrecta:'}</span>
            {question.prompt}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onRetry}>
          Intentar de nuevo
        </Button>
        <Link
          to="/estudio"
          className="inline-flex min-h-11 items-center rounded-full bg-brand-600 px-5 font-bold text-white"
        >
          Volver a temas
        </Link>
      </div>
    </div>
  );
}
