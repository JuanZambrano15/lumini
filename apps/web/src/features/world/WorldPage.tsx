import mundo from '@/assets/scenes/mundo.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { type Hotspot, Scene } from '@/components/Scene';

const hotspots: Hotspot[] = [
  { to: '/casa', label: 'Mi casa', emoji: '🏕️', x: 1, y: 44, w: 35, h: 31 },
  { to: '/pozo', label: 'Pozo de los deseos', emoji: '🪣', x: 38, y: 33, w: 18, h: 41 },
  { to: '/salon', label: 'Salón', emoji: '📚', x: 56, y: 45, w: 19, h: 18 },
  { to: '/juegos', label: 'Juegos', emoji: '🎮', x: 72, y: 60, w: 27, h: 28 },
  { to: '/logros', label: 'Mis estrellas', emoji: '⭐', x: 70, y: 11, w: 21, h: 29 },
];

export function WorldPage() {
  return (
    <ChildLayout title="Mundo Lumini" backTo="/perfiles" backLabel="Perfiles">
      <Scene
        image={mundo}
        alt="Campamento con carpas, un pozo y una casa del árbol"
        hotspots={hotspots}
      />
    </ChildLayout>
  );
}
