import { Link } from 'react-router';
import { useProgress, useTopics } from '@/api/hooks';
import type { ActivityProgress, Topic } from '@/api/types';
import { useCurrentChild } from '@/auth/useActiveChild';
import pizarra from '@/assets/scenes/pizarra.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage, Spinner } from '@/components/Feedback';

export function StudyPage() {
  const { childId } = useCurrentChild();
  const topics = useTopics();
  const progress = useProgress(childId);

  return (
    <ChildLayout title="Temas" backTo="/salon" background={pizarra}>
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {topics.isLoading && <Spinner />}
        {topics.error && (
          <ErrorMessage error={topics.error} onRetry={() => void topics.refetch()} />
        )}
        {topics.data?.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index} progress={progress.data ?? []} />
        ))}
      </div>
    </ChildLayout>
  );
}

function TopicCard({
  topic,
  index,
  progress,
}: {
  topic: Topic;
  index: number;
  progress: ActivityProgress[];
}) {
  const bestFor = (activityId: number) => progress.find((p) => p.activityId === activityId);

  return (
    <details
      className="group overflow-hidden rounded-3xl bg-[#d9b48f] shadow-lg"
      open={index === 0}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-xl font-extrabold text-ink sm:text-2xl">
        <span>
          {index + 1}. {topic.title}
        </span>
        <span className="transition group-open:rotate-180" aria-hidden>
          ▼
        </span>
      </summary>
      <div className="grid gap-3 bg-[#f3e2cf] p-4 sm:grid-cols-3">
        <Link
          to={`/temas/${topic.slug}`}
          className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 text-center font-bold shadow hover:-translate-y-0.5"
        >
          <span className="text-4xl" aria-hidden>
            🎬
          </span>
          Tutorial
        </Link>
        {topic.activities.map((activity) => {
          const best = bestFor(activity.id);
          return (
            <Link
              key={activity.id}
              to={`/actividades/${activity.id}`}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4 text-center font-bold shadow hover:-translate-y-0.5"
            >
              <span className="text-4xl" aria-hidden>
                {activity.kind === 'EVALUATION' ? '🏆' : '✏️'}
              </span>
              {activity.kind === 'EVALUATION' ? 'Evaluación' : 'Actividades'}
              <span className="text-sm font-semibold text-ink/60">
                {best ? `Récord: ${best.bestCorrect}/${activity.questionCount}` : 'Sin intentar'}
              </span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
