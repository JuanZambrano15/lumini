import { Link } from 'react-router';
import { useOwnedItems, useShopItems } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';
import casa from '@/assets/scenes/casa-escena.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';
import { equippedItems, HOME_SLOT_POSITION } from '@/features/well/items';

/**
 * Dónde cae la ilustración original de la habitación dentro del frame "home"
 * del Figma; sirve para ubicar las decoraciones (sus posiciones están en % de esa imagen).
 */
const IMAGE = { x: 49, y: -1, w: 1342, h: 754 };

export function HousePage() {
  const { childId, data: child } = useCurrentChild();
  const { data: catalog = [] } = useShopItems();
  const { data: owned = [] } = useOwnedItems(childId);
  const decorations = equippedItems(catalog, owned).filter((item) => item.kind === 'HOME');

  return (
    <Stage background="#f6d6d8" exitTo="/mundo" title="Mi casa">
      <img
        src={casa}
        alt="Habitación con clóset, cama, repisas y dos ventanas"
        className="absolute inset-0 size-full"
      />

      {decorations.map((item) => {
        const position = HOME_SLOT_POSITION[item.slot];
        if (!position) return null;
        return (
          <span
            key={item.id}
            role="img"
            aria-label={item.name}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-pop leading-none drop-shadow-lg"
            style={{
              left: `${((IMAGE.x + (position.x / 100) * IMAGE.w) / 1440) * 100}%`,
              top: `${((IMAGE.y + (position.y / 100) * IMAGE.h) / 710) * 100}%`,
              fontSize: dp(100),
            }}
          >
            {item.emoji}
          </span>
        );
      })}

      {/* El clóset brilla al señalarlo y lleva a cambiar de personaje. */}
      <Link
        to="/closet"
        aria-label="Abrir el clóset"
        className="group absolute z-10 rounded-[2rem] focus-visible:outline-none"
        style={box(233, 68, 204, 548)}
      >
        <span
          aria-hidden
          className="absolute -inset-[8%] rounded-[3rem] opacity-0 blur-lg transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background: 'radial-gradient(closest-side, rgba(255, 236, 120, 0.7), transparent)',
          }}
        />
        <span
          className="absolute top-[38%] left-1/2 -translate-x-1/2 rounded-full bg-white px-[0.8em] py-[0.2em] font-semibold whitespace-nowrap text-ink opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ fontSize: `max(${dp(20)}, 13px)` }}
        >
          Clóset
        </span>
      </Link>

      {child && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={box(417, 328, 221, 383)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
    </Stage>
  );
}
