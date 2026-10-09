import { useOwnedItems, useShopItems } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';
import casa from '@/assets/scenes/casa.webp';
import { ChildLayout } from '@/components/ChildLayout';
import { type Hotspot, Scene } from '@/components/Scene';
import { equippedItems, HOME_SLOT_POSITION } from '@/features/well/items';

const hotspots: Hotspot[] = [
  { to: '/closet', label: 'Clóset', emoji: '👕', x: 13, y: 9, w: 17, h: 71 },
  { to: '/pozo', label: 'Decorar', emoji: '🛍️', x: 88, y: 60, w: 11, h: 20 },
];

export function HousePage() {
  const { childId } = useCurrentChild();
  const { data: catalog = [] } = useShopItems();
  const { data: owned = [] } = useOwnedItems(childId);
  const decorations = equippedItems(catalog, owned).filter((item) => item.kind === 'HOME');

  return (
    <ChildLayout title="Mi casa" backTo="/mundo">
      <Scene
        image={casa}
        alt="Habitación con clóset, cama y ventanas"
        hotspots={hotspots}
        overlay={decorations.map((item) => {
          const position = HOME_SLOT_POSITION[item.slot];
          if (!position) return null;
          return (
            <span
              key={item.id}
              role="img"
              aria-label={item.name}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-pop text-[7cqw] leading-none drop-shadow-lg"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              {item.emoji}
            </span>
          );
        })}
      />
    </ChildLayout>
  );
}
