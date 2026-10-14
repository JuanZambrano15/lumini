import { useState } from 'react';
import { Link } from 'react-router';
import { useProgress, useTopics } from '@/api/hooks';
import type { ActivityProgress, Topic } from '@/api/types';
import { useCurrentChild } from '@/auth/useActiveChild';
import pizarra from '@/assets/scenes/pizarra.webp';
import actividadesImg from '@/assets/study/actividades.webp';
import evaluacionImg from '@/assets/study/evaluacion.webp';
import tutorialConteo from '@/assets/study/tutorial-conteo.webp';
import tutorialFormas from '@/assets/study/tutorial-formas.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { ChevronDownIcon } from '@/components/Icons';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';

/** Ilustración del tutorial según el tema ("Study zona 3 y 4" del Figma). */
const tutorialImages: Record<string, string> = {
  'conteo-1-20': tutorialConteo,
  'formas-geometricas': tutorialFormas,
};

/** Color de las tarjetas de cada tema: amarillo, verde y rosa, en ese orden. */
const TILE_COLORS = ['#f3e19c', '#c2eab2', '#f8cfdc'];

export function StudyPage() {
  const { childId, data: child } = useCurrentChild();
  const topics = useTopics();
  const progress = useProgress(childId);
  const [openId, setOpenId] = useState<number | null>(null);
  const openIndex = topics.data?.findIndex((topic) => topic.id === openId) ?? -1;

  return (
    <Stage
      background="var(--color-study-bg)"
      exitTo="/salon"
      exitClassName="bg-salir-study"
      title="Temas"
    >
      <img src={pizarra} alt="" className="absolute max-w-none" style={box(160, -2, 1118, 743)} />

      <p
        aria-hidden
        className="absolute text-center font-black tracking-wide text-wood-ink"
        style={{
          ...box(470, 110, 500, 100),
          fontSize: dp(76),
          textShadow: `${dp(4)} ${dp(4)} 0 #caa27f`,
        }}
      >
        TEMAS
      </p>

      <div
        className="absolute z-10 flex flex-col gap-[1.4cqw] overflow-y-auto pr-[0.5cqw] pb-[1cqw]"
        style={box(228, 214, 1000, 470)}
      >
        {topics.isLoading && <Spinner />}
        {topics.error && (
          <ErrorMessage error={topics.error} onRetry={() => void topics.refetch()} />
        )}
        {/* Como en el Figma: al abrir un tema se ocultan los de abajo (menos distracciones). */}
        {topics.data?.map((topic, index) => (
          <TopicItem
            hidden={openIndex !== -1 && index > openIndex}
            key={topic.id}
            topic={topic}
            index={index}
            open={openId === topic.id}
            onToggle={() => setOpenId(openId === topic.id ? null : topic.id)}
            progress={progress.data ?? []}
          />
        ))}
      </div>

      {child && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={box(16, 353, 253, 438)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
    </Stage>
  );
}

interface TopicItemProps {
  hidden: boolean;
  topic: Topic;
  index: number;
  open: boolean;
  onToggle: () => void;
  progress: ActivityProgress[];
}

function TopicItem({ hidden, topic, index, open, onToggle, progress }: TopicItemProps) {
  if (hidden) return null;
  const panelId = `tema-${topic.id}`;
  const practice = topic.activities.find((activity) => activity.kind === 'PRACTICE');
  const evaluation = topic.activities.find((activity) => activity.kind === 'EVALUATION');
  const record = (activityId?: number) => {
    const best = progress.find((p) => p.activityId === activityId);
    const total = topic.activities.find((a) => a.id === activityId)?.questionCount;
    return best && total ? `${best.bestCorrect}/${total}` : undefined;
  };
  const color = TILE_COLORS[index % TILE_COLORS.length];

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="ml-[2cqw] flex max-w-[69cqw] min-w-[55cqw] items-center justify-between gap-[1.2cqw] rounded-[1.1cqw] bg-wood px-[1.2cqw] py-[0.6cqw] text-left font-read leading-tight text-wood-ink shadow-sm transition hover:brightness-105"
        style={{ fontSize: dp(42) }}
      >
        <span>
          {index + 1}. {topic.title}
        </span>
        <ChevronDownIcon
          className={`size-[1.1em] shrink-0 text-[#e4e4e4] drop-shadow-[0_2px_1px_rgba(0,0,0,0.35)] transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={panelId}
          className="mt-[1.4cqw] grid animate-pop grid-cols-3 gap-[3.2cqw] px-[0.2cqw]"
        >
          <Tile
            to={`/temas/${topic.slug}`}
            image={tutorialImages[topic.slug] ?? tutorialConteo}
            label="Tutorial"
            color={color}
          />
          {practice && (
            <Tile
              to={`/actividades/${practice.id}`}
              image={actividadesImg}
              label="Actividades"
              color={color}
              record={record(practice.id)}
            />
          )}
          {evaluation && (
            <Tile
              to={`/actividades/${evaluation.id}`}
              image={evaluacionImg}
              label="Evaluación"
              color={color}
              record={record(evaluation.id)}
            />
          )}
        </ul>
      )}
    </div>
  );
}

interface TileProps {
  to: string;
  image: string;
  label: string;
  color: string;
  record?: string;
}

function Tile({ to, image, label, color, record }: TileProps) {
  return (
    <li>
      <Link
        to={to}
        className="relative flex aspect-[297/233] flex-col items-center justify-between rounded-[1.8cqw] border-[0.25cqw] border-[#2b2b2b] p-[1cqw] transition hover:-translate-y-1 hover:shadow-lg"
        style={{ background: color }}
      >
        <img src={image} alt="" className="min-h-0 flex-1 object-contain" />
        <span
          className="font-bold tracking-wide text-wood-ink uppercase"
          style={{ fontSize: dp(32) }}
        >
          {label}
        </span>
        {record && (
          <span
            className="absolute top-[0.6cqw] right-[0.6cqw] rounded-full bg-white px-[0.6em] font-semibold text-ink shadow"
            style={{ fontSize: `max(${dp(16)}, 11px)` }}
            aria-label={`Récord ${record}`}
          >
            ⭐ {record}
          </span>
        )}
      </Link>
    </li>
  );
}
