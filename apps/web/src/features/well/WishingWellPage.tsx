import { useState } from 'react';
import pozo from '@/assets/icons/pozo.webp';
import mundo from '@/assets/scenes/mundo.webp';
import { useCurrentChild } from '@/auth/useActiveChild';
import { ChildLayout } from '@/components/ChildLayout';
import { AskLumiTab } from './AskLumiTab';
import { ShopTab } from './ShopTab';

type Tab = 'shop' | 'lumi';

const tabs: { key: Tab; label: string; emoji: string }[] = [
  { key: 'shop', label: 'Tienda', emoji: '🛍️' },
  { key: 'lumi', label: 'Pregúntale a Lumi', emoji: '💡' },
];

/**
 * Pozo de los deseos. El niño lanza las estrellas que ganó para:
 *  1. Conseguir objetos para personalizar su avatar y su casa.
 *  2. Pedir un deseo: hacerle una pregunta a Lumi, el asistente con IA.
 */
export function WishingWellPage() {
  const { data: child } = useCurrentChild();
  const [tab, setTab] = useState<Tab>('shop');
  const [dropping, setDropping] = useState(0);

  /** Animación de una estrella cayendo al pozo tras cada gasto. */
  function celebrate() {
    setDropping((count) => count + 1);
  }

  return (
    <ChildLayout title="Pozo de los deseos" backTo="/mundo" background={mundo}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="flex flex-col items-center gap-3 rounded-3xl bg-white/90 p-4 text-center shadow-xl sm:flex-row sm:justify-center sm:gap-6">
          <div className="relative">
            {dropping > 0 && (
              <span
                key={dropping}
                className="absolute top-0 left-1/2 -ml-5 animate-drop text-4xl"
                aria-hidden
              >
                ⭐
              </span>
            )}
            <img src={pozo} alt="" className="h-28 w-auto" />
          </div>
          <div>
            <p className="text-xl">
              Tienes <strong className="font-display text-3xl">⭐ {child?.stars ?? 0}</strong>
            </p>
            <p className="text-ink/70">Lánzalas al pozo para cumplir tus deseos</p>
          </div>
        </section>

        <div role="tablist" aria-label="Deseos" className="flex justify-center gap-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={tab === item.key}
              aria-controls={`panel-${item.key}`}
              onClick={() => setTab(item.key)}
              className={`rounded-full px-5 py-2 font-display text-lg font-extrabold shadow transition ${
                tab === item.key ? 'bg-brand-600 text-white' : 'bg-white text-brand-700'
              }`}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'shop' ? <ShopTab onSpend={celebrate} /> : <AskLumiTab onSpend={celebrate} />}
        </div>
      </div>
    </ChildLayout>
  );
}
