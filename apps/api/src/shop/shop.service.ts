import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Child, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StarsService } from '../stars/stars.service';

/**
 * Tienda del pozo de los deseos: el niño canjea estrellas por objetos para su
 * avatar y su casa. Solo puede haber un objeto equipado por espacio (slot).
 */
@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stars: StarsService,
  ) {}

  listItems() {
    return this.prisma.shopItem.findMany({ orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }] });
  }

  listOwned(child: Child) {
    return this.prisma.childItem.findMany({
      where: { childId: child.id },
      select: { itemId: true, equipped: true, purchasedAt: true },
      orderBy: { purchasedAt: 'asc' },
    });
  }

  purchase(child: Child, itemId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.shopItem.findUnique({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Objeto no encontrado');

      const owned = await tx.childItem.findUnique({
        where: { childId_itemId: { childId: child.id, itemId } },
      });
      if (owned) throw new ConflictException('Ya tienes este objeto');

      await this.stars.spend(tx, {
        childId: child.id,
        amount: item.cost,
        reason: 'SHOP_PURCHASE',
        referenceId: String(item.id),
        description: `Tienda: ${item.name}`,
      });

      // Lo recién comprado se equipa de una vez: es lo que el niño quiere ver.
      await this.unequipSlot(tx, child.id, item.slot);
      return tx.childItem.create({
        data: { childId: child.id, itemId, equipped: true },
        select: { itemId: true, equipped: true, purchasedAt: true },
      });
    });
  }

  setEquipped(child: Child, itemId: number, equipped: boolean) {
    return this.prisma.$transaction(async (tx) => {
      const owned = await tx.childItem.findUnique({
        where: { childId_itemId: { childId: child.id, itemId } },
        include: { item: true },
      });
      if (!owned) throw new BadRequestException('Primero compra este objeto');

      if (equipped) await this.unequipSlot(tx, child.id, owned.item.slot);
      return tx.childItem.update({
        where: { childId_itemId: { childId: child.id, itemId } },
        data: { equipped },
        select: { itemId: true, equipped: true, purchasedAt: true },
      });
    });
  }

  private async unequipSlot(
    tx: Prisma.TransactionClient,
    childId: string,
    slot: Prisma.ShopItemWhereInput['slot'],
  ): Promise<void> {
    await tx.childItem.updateMany({
      where: { childId, equipped: true, item: { slot } },
      data: { equipped: false },
    });
  }
}
