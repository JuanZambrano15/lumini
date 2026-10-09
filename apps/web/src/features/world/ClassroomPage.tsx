import salon from '@/assets/scenes/salon.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { type Hotspot, Scene } from '@/components/Scene';

const hotspots: Hotspot[] = [
  { to: '/estudio', label: 'Tablero de temas', emoji: '✏️', x: 34, y: 36, w: 36, h: 27 },
];

export function ClassroomPage() {
  return (
    <ChildLayout title="Salón" backTo="/mundo">
      <Scene image={salon} alt="Salón de clases con tablero y pupitres" hotspots={hotspots} />
    </ChildLayout>
  );
}
