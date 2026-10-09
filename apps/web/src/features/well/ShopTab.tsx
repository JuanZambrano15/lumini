import { useState } from 'react';
import { Link } from 'react-router';
import { useEquipItem, useOwnedItems, usePurchaseItem, useShopItems } from '@/api/hooks';
import type { ItemKind, ShopItem } from '@/api/types';
import { useCurrentChild } from '@/auth/useActiveChild';
import { Button } from '@/components/Button';
import { ErrorMessage, Spinner } from '@/components/Feedback';
import { Modal } from '@/components/Modal';
import { SLOT_LABEL } from './items';

const sections: { kind: ItemKind; title: string; seeIn: { to: string; label: string } }[] = [
  { kind: 'AVATAR', title: 'Para mi avatar', seeIn: { to: '/closet', label: 'Ver en el clóset' } },
  { kind: 'HOME', title: 'Para mi casa', seeIn: { to: '/casa', label: 'Ver mi casa' } },
];

export function ShopTab({ onSpend }: { onSpend: () => void }) {
  const { childId, data: child } = useCurrentChild();
  const { data: catalog, isLoading, error, refetch } = useShopItems();
  const { data: owned = [] } = useOwnedItems(childId);
  const purchase = usePurchaseItem(childId);
  const equip = useEquipItem(childId);
  const [confirming, setConfirming] = useState<ShopItem | null>(null);

  const stars = child?.stars ?? 0;
  const ownership = (itemId: number) => owned.find((item) => item.itemId === itemId);

  function buy(item: ShopItem) {
    setConfirming(null);
    purchase.mutate(item.id, { onSuccess: onSpend });
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => void refetch()} />;

  return (
    <div className="flex flex-col gap-6">
      {(purchase.error || equip.error) && <ErrorMessage error={purchase.error ?? equip.error} />}

      {sections.map((section) => (
        <section key={section.kind}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="rounded-full bg-white/90 px-4 py-1 text-2xl font-extrabold text-brand-700">
              {section.title}
            </h2>
            <Link
              to={section.seeIn.to}
              className="rounded-full bg-white/90 px-4 py-1 font-bold text-brand-700 hover:bg-white"
            >
              {section.seeIn.label} →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {catalog
              ?.filter((item) => item.kind === section.kind)
              .map((item) => {
                const own = ownership(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex flex-col items-center gap-1 rounded-3xl bg-white p-4 text-center shadow-lg"
                  >
                    <span className="text-5xl" aria-hidden>
                      {item.emoji}
                    </span>
                    <p className="font-extrabold">{item.name}</p>
                    <p className="text-xs text-ink/60">{SLOT_LABEL[item.slot]}</p>
                    {own ? (
                      <Button
                        variant={own.equipped ? 'secondary' : 'primary'}
                        className="min-h-9 px-3 text-sm"
                        disabled={equip.isPending}
                        onClick={() => equip.mutate({ itemId: item.id, equipped: !own.equipped })}
                      >
                        {own.equipped ? 'Quitar' : 'Usar'}
                      </Button>
                    ) : (
                      <Button
                        variant="sun"
                        className="min-h-9 px-3 text-sm"
                        disabled={stars < item.cost || purchase.isPending}
                        onClick={() => setConfirming(item)}
                        aria-label={`Comprar ${item.name} por ${item.cost} estrellas`}
                      >
                        ⭐ {item.cost}
                      </Button>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      <Modal
        title="¿Lanzar estrellas al pozo?"
        open={confirming !== null}
        onClose={() => setConfirming(null)}
      >
        {confirming && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-6xl">{confirming.emoji}</p>
            <p className="text-xl font-bold">{confirming.name}</p>
            <p>
              Cuesta <strong>{confirming.cost} ⭐</strong>. Te quedarán {stars - confirming.cost}.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setConfirming(null)}>
                Todavía no
              </Button>
              <Button variant="sun" onClick={() => buy(confirming)}>
                ¡Sí, lo quiero!
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
