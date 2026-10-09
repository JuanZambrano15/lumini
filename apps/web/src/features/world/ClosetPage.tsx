import { useAvatars, useEquipItem, useOwnedItems, useShopItems, useUpdateChild } from '@/api/hooks';
import { useCurrentChild } from '@/auth/useActiveChild';
import closet from '@/assets/scenes/closet.webp';
import { AvatarImage } from '@/components/AvatarImage';
import { ChildAvatar } from '@/components/ChildAvatar';
import { ChildLayout } from '@/components/ChildLayout';
import { ErrorMessage } from '@/components/Feedback';
import { SLOT_LABEL } from '@/features/well/items';
import { Link } from 'react-router';

export function ClosetPage() {
  const { childId, data: child } = useCurrentChild();
  const { data: avatars = [] } = useAvatars();
  const { data: catalog = [] } = useShopItems();
  const { data: owned = [] } = useOwnedItems(childId);
  const updateChild = useUpdateChild(childId);
  const equipItem = useEquipItem(childId);

  const accessories = catalog.filter(
    (item) => item.kind === 'AVATAR' && owned.some((own) => own.itemId === item.id),
  );
  const isEquipped = (itemId: number) => owned.some((own) => own.itemId === itemId && own.equipped);

  return (
    <ChildLayout title="Clóset" backTo="/casa" background={closet}>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[18rem_1fr]">
        <section className="flex flex-col items-center rounded-3xl bg-white/90 p-6 shadow-xl">
          {child && <ChildAvatar child={child} className="h-72 w-52 animate-pop" />}
          <p className="mt-2 font-display text-2xl font-extrabold text-brand-700">{child?.name}</p>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white/90 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-extrabold text-brand-700">Elige tu personaje</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {avatars.map((avatar) => {
                const selected = child?.avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    aria-pressed={selected}
                    aria-label={avatar.name}
                    disabled={updateChild.isPending}
                    onClick={() => updateChild.mutate({ avatarId: avatar.id })}
                    className={`rounded-2xl p-2 transition ${selected ? 'bg-brand-200 ring-4 ring-brand-500' : 'bg-brand-50 hover:bg-brand-100'}`}
                  >
                    <AvatarImage avatarId={avatar.id} className="mx-auto h-20 w-full" />
                    <span className="text-sm font-bold">{avatar.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-white/90 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-extrabold text-brand-700">Mis accesorios</h2>
            {accessories.length === 0 ? (
              <p>
                Aún no tienes accesorios.{' '}
                <Link to="/pozo" className="font-bold text-brand-700 underline">
                  Consíguelos en el pozo de los deseos
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {accessories.map((item) => {
                  const equipped = isEquipped(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={equipped}
                      disabled={equipItem.isPending}
                      onClick={() => equipItem.mutate({ itemId: item.id, equipped: !equipped })}
                      className={`flex flex-col items-center rounded-2xl p-2 transition ${equipped ? 'bg-brand-200 ring-4 ring-brand-500' : 'bg-brand-50 hover:bg-brand-100'}`}
                    >
                      <span className="text-4xl" aria-hidden>
                        {item.emoji}
                      </span>
                      <span className="text-sm font-bold">{item.name}</span>
                      <span className="text-xs text-ink/60">{SLOT_LABEL[item.slot]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {(updateChild.error || equipItem.error) && (
            <ErrorMessage error={updateChild.error ?? equipItem.error} />
          )}
        </div>
      </div>
    </ChildLayout>
  );
}
