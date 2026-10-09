import { BadRequestException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { StarsService } from './stars.service';

function createTx() {
  return {
    child: { update: jest.fn(), updateMany: jest.fn() },
    starTransaction: { create: jest.fn() },
  };
}

describe('StarsService', () => {
  const service = new StarsService();
  const movement = { childId: 'c1', amount: 5, reason: 'SHOP_PURCHASE' as const, description: 'x' };

  it('award incrementa el saldo y registra el movimiento', async () => {
    const tx = createTx();
    await service.award(tx as unknown as Prisma.TransactionClient, { ...movement, reason: 'GAME' });

    expect(tx.child.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { stars: { increment: 5 } },
    });
    expect(tx.starTransaction.create).toHaveBeenCalled();
  });

  it('award ignora montos no positivos', async () => {
    const tx = createTx();
    await service.award(tx as unknown as Prisma.TransactionClient, { ...movement, amount: 0 });
    expect(tx.child.update).not.toHaveBeenCalled();
  });

  it('spend registra un movimiento negativo cuando hay saldo', async () => {
    const tx = createTx();
    tx.child.updateMany.mockResolvedValue({ count: 1 });
    await service.spend(tx as unknown as Prisma.TransactionClient, movement);

    expect(tx.child.updateMany).toHaveBeenCalledWith({
      where: { id: 'c1', stars: { gte: 5 } },
      data: { stars: { decrement: 5 } },
    });
    expect(tx.starTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ amount: -5 }),
    });
  });

  it('spend falla sin saldo suficiente y no registra nada', async () => {
    const tx = createTx();
    tx.child.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.spend(tx as unknown as Prisma.TransactionClient, movement),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.starTransaction.create).not.toHaveBeenCalled();
  });
});
