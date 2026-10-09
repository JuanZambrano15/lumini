import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Child } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StarsService } from '../stars/stars.service';
import {
  computeActivityStars,
  EVALUATION_PASS_RATIO,
  gradeAnswers,
  parseQuestions,
  parseTutorial,
  toPublicQuestions,
} from './content';

@Injectable()
export class LearningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stars: StarsService,
  ) {}

  async listTopics() {
    const topics = await this.prisma.topic.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { activities: { orderBy: { sortOrder: 'asc' } } },
    });
    return topics.map(({ tutorial: _tutorial, activities, ...topic }) => ({
      ...topic,
      activities: activities.map(({ questions, ...activity }) => ({
        ...activity,
        questionCount: parseQuestions(questions).length,
      })),
    }));
  }

  async getTopic(slug: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
      include: {
        activities: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, slug: true, title: true, kind: true },
        },
      },
    });
    if (!topic) throw new NotFoundException('Tema no encontrado');
    return { ...topic, tutorial: parseTutorial(topic.tutorial) };
  }

  async getActivity(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { topic: { select: { slug: true, title: true } } },
    });
    if (!activity) throw new NotFoundException('Actividad no encontrada');
    return { ...activity, questions: toPublicQuestions(parseQuestions(activity.questions)) };
  }

  /** Mejor resultado por actividad, para marcar el avance del niño en la UI. */
  async progress(child: Child) {
    const grouped = await this.prisma.activityAttempt.groupBy({
      by: ['activityId'],
      where: { childId: child.id },
      _max: { correct: true },
      _count: { _all: true },
    });
    return grouped.map((row) => ({
      activityId: row.activityId,
      bestCorrect: row._max.correct ?? 0,
      attempts: row._count._all,
    }));
  }

  async submitAttempt(child: Child, activityId: number, answers: number[]) {
    const activity = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) throw new NotFoundException('Actividad no encontrada');

    const questions = parseQuestions(activity.questions);
    if (answers.length !== questions.length) {
      throw new BadRequestException(`Se esperaban ${questions.length} respuestas`);
    }
    const grade = gradeAnswers(questions, answers);

    return this.prisma.$transaction(async (tx) => {
      const best = await tx.activityAttempt.aggregate({
        where: { childId: child.id, activityId },
        _max: { correct: true },
      });
      const previousBestCorrect = best._max.correct ?? 0;

      const starsEarned = computeActivityStars({
        kind: activity.kind,
        correct: grade.correct,
        total: grade.total,
        previousBestCorrect,
        passedBefore: previousBestCorrect / grade.total >= EVALUATION_PASS_RATIO,
      });

      const attempt = await tx.activityAttempt.create({
        data: {
          childId: child.id,
          activityId,
          correct: grade.correct,
          total: grade.total,
          starsEarned,
        },
      });

      await this.stars.award(tx, {
        childId: child.id,
        amount: starsEarned,
        reason: 'ACTIVITY',
        referenceId: attempt.id,
        description: `Actividad: ${activity.title}`,
      });

      return {
        attemptId: attempt.id,
        ...grade,
        starsEarned,
        isNewRecord: grade.correct > previousBestCorrect,
      };
    });
  }
}
