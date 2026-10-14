import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useAvatars, useEquipItem, useOwnedItems, useShopItems, useUpdateChild } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';
import closet from '@/assets/scenes/closet-escena.webp';
import { ChildAvatar } from '@/components/ChildAvatar';
import { ErrorMessage } from '@/components/Feedback';
import { Stage } from '@/components/Stage';
import { box, dp } from '@/lib/stage';

/**
 * Clóset ("home 2–7" del Figma): el personaje sobre el podio y flechas para
 * cambiarlo. La primera pantalla solo tiene flecha derecha y la última solo izquierda.
 */
export function ClosetPage() {
  const { childId, data: child } = useCurrentChild();
  const { data: avatars = [] } = useAvatars();
  const { data: catalog = [] } = useShopItems();
  const { data: owned = [] } = useOwnedItems(childId);
  const updateChild = useUpdateChild(childId);
  const equipItem = useEquipItem(childId);

  const index = avatars.findIndex((avatar) => avatar.id === child?.avatarId);
  const previous = index > 0 ? avatars[index - 1] : undefined;
  const next = index >= 0 && index < avatars.length - 1 ? avatars[index + 1] : undefined;
  const current = avatars[index];

  const accessories = catalog.filter(
    (item) => item.kind === 'AVATAR' && owned.some((own) => own.itemId === item.id),
  );
  const isEquipped = (itemId: number) => owned.some((own) => own.itemId === itemId && own.equipped);

  return (
    <Stage background="var(--color-closet-bg)" exitTo="/casa" title="Clóset">
      <img
        src={closet}
        alt="Clóset con ropa colgada y un podio blanco"
        className="absolute inset-0 size-full"
      />

      {child && (
        <div
          key={child.avatarId}
          className="pointer-events-none absolute z-10 animate-pop"
          style={box(592, 205, 270, 465)}
        >
          <ChildAvatar child={child} className="size-full" />
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {current ? `Personaje: ${current.name}` : ''}
      </p>

      {previous && (
        <ArrowButton
          direction="left"
          label={`Personaje anterior: ${previous.name}`}
          disabled={updateChild.isPending}
          onClick={() => updateChild.mutate({ avatarId: previous.id })}
          style={box(440, 355, 142, 146)}
        />
      )}
      {next && (
        <ArrowButton
          direction="right"
          label={`Siguiente personaje: ${next.name}`}
          disabled={updateChild.isPending}
          onClick={() => updateChild.mutate({ avatarId: next.id })}
          style={box(870, 355, 142, 146)}
        />
      )}

      {/* Accesorios comprados en el pozo (no están en el Figma): margen derecho. */}
      <aside
        aria-label="Mis accesorios"
        className="absolute z-20 flex flex-col items-center gap-[0.6em] overflow-y-auto"
        style={{ ...box(1288, 90, 140, 540), fontSize: `max(${dp(16)}, 12px)` }}
      >
        {accessories.length === 0 ? (
          <Link
            to="/pozo"
            className="rounded-2xl bg-white/85 p-[0.6em] text-center font-semibold text-ink shadow"
          >
            Consigue accesorios en el pozo 🪣
          </Link>
        ) : (
          accessories.map((item) => {
            const equipped = isEquipped(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={equipped}
                aria-label={`${equipped ? 'Quitar' : 'Ponerme'} ${item.name}`}
                disabled={equipItem.isPending}
                onClick={() => equipItem.mutate({ itemId: item.id, equipped: !equipped })}
                className={`grid aspect-square w-[70%] place-items-center rounded-2xl shadow transition ${equipped ? 'bg-white ring-4 ring-brand-600' : 'bg-white/70 hover:bg-white'}`}
                style={{ fontSize: dp(44) }}
              >
                <span aria-hidden>{item.emoji}</span>
              </button>
            );
          })
        )}
      </aside>

      {(updateChild.error || equipItem.error) && (
        <div className="absolute inset-x-0 bottom-[12%] z-30">
          <ErrorMessage error={updateChild.error ?? equipItem.error} />
        </div>
      )}
    </Stage>
  );
}

interface ArrowButtonProps {
  direction: 'left' | 'right';
  label: string;
  disabled: boolean;
  onClick: () => void;
  style: CSSProperties;
}

/** Flecha negra con contorno desplazado, como en el Figma. */
function ArrowButton({ direction, label, disabled, onClick, style }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="absolute z-20 transition hover:scale-110 active:scale-95 disabled:opacity-50"
      style={style}
    >
      <svg
        viewBox="0 0 142 146"
        className={`size-full drop-shadow ${direction === 'right' ? '-scale-x-100' : ''}`}
        aria-hidden
      >
        <path
          d="M6 73 136 3 92 73l44 70Z"
          fill="none"
          stroke="#111"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M24 73 132 14 96 73l36 59Z" fill="#000" />
      </svg>
    </button>
  );
}
