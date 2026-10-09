import { useOwnedItems, useShopItems } from '@/api/hooks';
import type { Child } from '@/api/types';
import { AVATAR_SLOT_STYLE, equippedItems } from '@/features/well/items';
import { AvatarImage } from './AvatarImage';

/** Avatar del niño con los accesorios que compró en el pozo de los deseos. */
export function ChildAvatar({ child, className = '' }: { child: Child; className?: string }) {
  const { data: catalog = [] } = useShopItems();
  const { data: owned = [] } = useOwnedItems(child.id);
  const accessories = equippedItems(catalog, owned).filter((item) => item.kind === 'AVATAR');

  return (
    // @container permite dimensionar los accesorios en % del ancho del avatar (cqw).
    <div className={`@container relative ${className}`}>
      <AvatarImage avatarId={child.avatarId} className="size-full" alt={child.name} />
      {accessories.map((item) => {
        const style = AVATAR_SLOT_STYLE[item.slot];
        if (!style) return null;
        return (
          <span
            key={item.id}
            role="img"
            aria-label={item.name}
            className="absolute -translate-x-1/2 leading-none drop-shadow"
            style={{ top: `${style.top}%`, left: `${style.left}%`, fontSize: `${style.size}cqw` }}
          >
            {item.emoji}
          </span>
        );
      })}
    </div>
  );
}
