import type { ItemSlot, OwnedItem, ShopItem } from '@/api/types';

/**
 * Posición de cada accesorio sobre el avatar: top/left en % y tamaño en % del
 * ancho del avatar (unidades cqw), así escala igual en cualquier tamaño.
 */
export const AVATAR_SLOT_STYLE: Partial<
  Record<ItemSlot, { top: number; left: number; size: number }>
> = {
  HEAD: { top: -8, left: 50, size: 34 },
  FACE: { top: 10, left: 50, size: 24 },
  BACK: { top: 36, left: 84, size: 26 },
};

/** Lugar fijo (en % de la escena de la casa) para cada tipo de decoración. */
export const HOME_SLOT_POSITION: Partial<Record<ItemSlot, { x: number; y: number }>> = {
  HOME_FLOOR: { x: 47, y: 80 },
  HOME_WALL: { x: 65, y: 47 },
  HOME_SHELF: { x: 60, y: 19 },
  HOME_WINDOW: { x: 81, y: 30 },
};

export const SLOT_LABEL: Record<ItemSlot, string> = {
  HEAD: 'Cabeza',
  FACE: 'Cara',
  BACK: 'Espalda',
  HOME_FLOOR: 'Piso',
  HOME_WALL: 'Pared',
  HOME_SHELF: 'Repisa',
  HOME_WINDOW: 'Ventana',
};

/** Objetos que el niño tiene equipados, con sus datos del catálogo. */
export function equippedItems(catalog: ShopItem[], owned: OwnedItem[]): ShopItem[] {
  const equippedIds = new Set(owned.filter((item) => item.equipped).map((item) => item.itemId));
  return catalog.filter((item) => equippedIds.has(item.id));
}
