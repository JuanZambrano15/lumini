import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Child } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StarsService } from '../stars/stars.service';
import type { CreateGameSessionDto } from './dto/create-game-session.dto';
import { computeGameStars } from './game-stars';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stars: StarsService,
  ) {}

  list() {
    return this.prisma.game.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });
  }

  async recordSession(child: Child, slug: string, dto: CreateGameSessionDto) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new NotFoundException('Juego no encontrado');
    if (!game.isAvailable) throw new BadRequestException('Este juego todavía no está disponible');

    return this.prisma.$transaction(async (tx) => {
      // Ventana móvil de 24 h: no depende de la zona horaria del servidor.
      const since = new Date(Date.now() - DAY_MS);
      const recent = await tx.gameSession.aggregate({
        where: { childId: child.id, gameId: game.id, createdAt: { gte: since } },
        _sum: { starsEarned: true },
      });

      const starsEarned = computeGameStars(
        dto.score,
        game.maxStarsPerSession,
        recent._sum.starsEarned ?? 0,
      );

      const session = await tx.gameSession.create({
        data: {
          childId: child.id,
          gameId: game.id,
          score: dto.score,
          durationSec: dto.durationSec,
          starsEarned,
        },
      });

      await this.stars.award(tx, {
        childId: child.id,
        amount: starsEarned,
        reason: 'GAME',
        referenceId: session.id,
        description: `Juego: ${game.name}`,
      });

      return { sessionId: session.id, starsEarned };
    });
  }
}
