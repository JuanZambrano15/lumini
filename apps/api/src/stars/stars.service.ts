import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma, StarReason } from '../generated/prisma/client';

type Tx = Prisma.TransactionClient;

interface StarMovement {
  childId: string;
  amount: number;
  reason: StarReason;
  description: string;
  referenceId?: string;
}

/**
 * Único punto que modifica el saldo de estrellas. Siempre se usa dentro de una
 * transacción para que el saldo (children.stars) y el libro mayor
 * (star_transactions) nunca queden desincronizados.
 */
@Injectable()
export class StarsService {
  async award(tx: Tx, movement: StarMovement): Promise<void> {
    if (movement.amount <= 0) return;
    await tx.child.update({
      where: { id: movement.childId },
      data: { stars: { increment: movement.amount } },
    });
    await tx.starTransaction.create({ data: movement });
  }

  /**
   * Descuenta estrellas de forma atómica: el UPDATE solo afecta la fila si el
   * saldo alcanza, así dos peticiones simultáneas no pueden dejarlo en negativo.
   */
  async spend(tx: Tx, movement: StarMovement): Promise<void> {
    const { count } = await tx.child.updateMany({
      where: { id: movement.childId, stars: { gte: movement.amount } },
      data: { stars: { decrement: movement.amount } },
    });
    if (count === 0) throw new BadRequestException('No tienes suficientes estrellas');

    await tx.starTransaction.create({ data: { ...movement, amount: -movement.amount } });
  }
}
