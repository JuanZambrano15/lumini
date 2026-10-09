import { BadRequestException, Injectable } from '@nestjs/common';
import type { Child } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ChildSettingsDto, CreateChildDto, UpdateChildDto } from './dto/child.dto';

export const MAX_CHILDREN_PER_ACCOUNT = 3;

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string): Promise<Child[]> {
    return this.prisma.child.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }

  async create(userId: string, dto: CreateChildDto): Promise<Child> {
    const count = await this.prisma.child.count({ where: { userId } });
    if (count >= MAX_CHILDREN_PER_ACCOUNT) {
      throw new BadRequestException(`Puedes tener máximo ${MAX_CHILDREN_PER_ACCOUNT} perfiles`);
    }

    const avatarId = await this.resolveAvatarId(dto.avatarId);
    return this.prisma.child.create({
      data: {
        userId,
        name: dto.name.trim(),
        gender: dto.gender,
        supportNeed: dto.supportNeed,
        avatarId,
      },
    });
  }

  async update(child: Child, dto: UpdateChildDto): Promise<Child> {
    const avatarId =
      dto.avatarId === undefined ? undefined : await this.resolveAvatarId(dto.avatarId);
    return this.prisma.child.update({
      where: { id: child.id },
      data: {
        name: dto.name?.trim(),
        gender: dto.gender,
        supportNeed: dto.supportNeed,
        avatarId,
      },
    });
  }

  /** Ajustes que solo los padres pueden cambiar (requiere PIN). */
  updateSettings(child: Child, dto: ChildSettingsDto): Promise<Child> {
    return this.prisma.child.update({
      where: { id: child.id },
      data: { aiEnabled: dto.aiEnabled },
    });
  }

  async remove(child: Child): Promise<void> {
    await this.prisma.child.delete({ where: { id: child.id } });
  }

  /** Resumen para la zona de padres: estrellas, avance por tema y actividad reciente. */
  async summary(child: Child) {
    const [topics, attempts, gamesPlayed, questions, flaggedQuestions, recentTransactions] =
      await Promise.all([
        this.prisma.topic.findMany({
          orderBy: { sortOrder: 'asc' },
          include: { activities: { select: { id: true } } },
        }),
        this.prisma.activityAttempt.findMany({
          where: { childId: child.id },
          select: { activityId: true, correct: true, total: true },
        }),
        this.prisma.gameSession.count({ where: { childId: child.id } }),
        this.prisma.aiQuestion.count({ where: { childId: child.id } }),
        this.prisma.aiQuestion.count({ where: { childId: child.id, status: { not: 'ANSWERED' } } }),
        this.prisma.starTransaction.findMany({
          where: { childId: child.id },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    const completed = new Set(attempts.map((attempt) => attempt.activityId));
    const totals = attempts.reduce(
      (acc, attempt) => ({
        correct: acc.correct + attempt.correct,
        total: acc.total + attempt.total,
      }),
      { correct: 0, total: 0 },
    );

    return {
      child,
      stars: child.stars,
      activityAttempts: attempts.length,
      averageScore: totals.total ? Math.round((totals.correct / totals.total) * 100) : null,
      gamesPlayed,
      questions,
      flaggedQuestions,
      topics: topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        totalActivities: topic.activities.length,
        completedActivities: topic.activities.filter((activity) => completed.has(activity.id))
          .length,
      })),
      recentTransactions,
    };
  }

  private async resolveAvatarId(avatarId?: number): Promise<number> {
    const avatar = avatarId
      ? await this.prisma.avatar.findUnique({ where: { id: avatarId } })
      : await this.prisma.avatar.findFirst({ orderBy: { sortOrder: 'asc' } });
    if (!avatar) throw new BadRequestException('Avatar no válido');
    return avatar.id;
  }
}
