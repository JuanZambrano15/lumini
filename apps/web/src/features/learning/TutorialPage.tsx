import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTopic } from '@/api/hooks';
import { Button } from '@/components/Button';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage, Spinner } from '@/components/Feedback';

export function TutorialPage() {
  const { slug = '' } = useParams();
  const { data: topic, isLoading, error, refetch } = useTopic(slug);
  const [step, setStep] = useState(0);

  const current = topic?.tutorial[step];
  const isLast = topic ? step === topic.tutorial.length - 1 : false;
  const practice = topic?.activities.find((activity) => activity.kind === 'PRACTICE');

  return (
    <ChildLayout title={topic?.title ?? 'Tutorial'} backTo="/estudio">
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl bg-white p-6 text-center shadow-xl">
        {isLoading && <Spinner />}
        {error && <ErrorMessage error={error} onRetry={() => void refetch()} />}
        {topic && current && (
          <>
            <p className="font-bold text-brand-500">
              Paso {step + 1} de {topic.tutorial.length}
            </p>
            <h2 key={step} className="animate-pop text-3xl font-extrabold text-brand-700">
              {current.title}
            </h2>
            {current.visual && (
              <p className="text-5xl leading-snug sm:text-6xl">{current.visual}</p>
            )}
            <p className="text-xl">{current.text}</p>
            <div className="flex gap-3">
              <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
                ← Anterior
              </Button>
              {isLast ? (
                practice && (
                  <Link
                    to={`/actividades/${practice.id}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-sun px-5 font-bold shadow-[0_4px_0_#c9a800]"
                  >
                    ¡A practicar! ✏️
                  </Link>
                )
              ) : (
                <Button onClick={() => setStep(step + 1)}>Siguiente →</Button>
              )}
            </div>
          </>
        )}
      </section>
    </ChildLayout>
  );
}
