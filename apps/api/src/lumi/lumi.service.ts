import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env';
import type { AiQuestion, Child } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StarsService } from '../stars/stars.service';
import { checkQuestion, SAFE_MESSAGES, sanitizeAnswer } from './content-filter';
import { LumiAiService } from './lumi-ai.service';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface LumiStatus {
  /** Los padres activaron la función para este niño. */
  enabled: boolean;
  /** El servidor tiene la IA configurada. */
  available: boolean;
  cost: number;
  remainingToday: number;
}

/**
 * "Cumplir deseos" del pozo: el niño lanza estrellas para hacerle una pregunta
 * a Lumi. Capas de seguridad, en orden:
 *  1. Permiso de los padres (desactivado por defecto) y límite diario.
 *  2. Filtro local: datos personales y groserías nunca llegan a la IA.
 *  3. La IA responde con un prompt para niños y clasifica la pregunta.
 *  4. Si la marca como no segura, se muestra un mensaje fijo, no el de la IA.
 *  5. Todo queda registrado para que los padres lo revisen.
 */
@Injectable()
export class LumiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stars: StarsService,
    private readonly ai: LumiAiService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  private get cost(): number {
    return this.config.get('LUMI_QUESTION_COST', { infer: true });
  }

  private get dailyLimit(): number {
    return this.config.get('LUMI_DAILY_LIMIT', { infer: true });
  }

  async status(child: Child): Promise<LumiStatus> {
    return {
      enabled: child.aiEnabled,
      available: this.ai.isAvailable(),
      cost: this.cost,
      remainingToday: Math.max(0, this.dailyLimit - (await this.countRecent(child.id))),
    };
  }

  history(child: Child): Promise<AiQuestion[]> {
    return this.prisma.aiQuestion.findMany({
      where: { childId: child.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async ask(child: Child, rawQuestion: string): Promise<AiQuestion> {
    if (!child.aiEnabled) {
      throw new ForbiddenException('Pídele a tus papás que activen a Lumi en la Zona de padres');
    }
    if ((await this.countRecent(child.id)) >= this.dailyLimit) {
      throw new HttpException(
        '¡Ya hiciste muchas preguntas hoy! Vuelve mañana 🌙',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const filter = checkQuestion(rawQuestion);
    if (!filter.allowed) {
      // Bloqueada localmente: no se consulta la IA ni se cobran estrellas.
      return this.record(child, rawQuestion.slice(0, 600), {
        answer: SAFE_MESSAGES[filter.reason],
        status: 'BLOCKED',
        reason: filter.reason,
        starsSpent: 0,
      });
    }

    // Se cobra antes de llamar a la IA (el saldo se valida de forma atómica) y se
    // devuelve si la IA falla, para no regalar preguntas ni cobrar sin responder.
    await this.prisma.$transaction((tx) =>
      this.stars.spend(tx, {
        childId: child.id,
        amount: this.cost,
        reason: 'AI_QUESTION',
        description: 'Pregunta a Lumi',
      }),
    );

    let result;
    try {
      result = await this.ai.answer(filter.text);
    } catch (error) {
      await this.prisma.$transaction((tx) =>
        this.stars.award(tx, {
          childId: child.id,
          amount: this.cost,
          reason: 'AI_REFUND',
          description: 'Lumi no pudo responder: estrellas devueltas',
        }),
      );
      throw error;
    }

    const answer = sanitizeAnswer(result.answer);
    if (!result.safe || !answer) {
      return this.record(child, filter.text, {
        answer: result.category === 'self_harm' ? SAFE_MESSAGES.self_harm : SAFE_MESSAGES.redirect,
        status: 'REDIRECTED',
        reason: result.category,
        starsSpent: this.cost,
      });
    }

    return this.record(child, filter.text, {
      answer,
      status: 'ANSWERED',
      reason: null,
      starsSpent: this.cost,
    });
  }

  private record(
    child: Child,
    question: string,
    data: Pick<AiQuestion, 'answer' | 'status' | 'reason' | 'starsSpent'>,
  ): Promise<AiQuestion> {
    return this.prisma.aiQuestion.create({ data: { childId: child.id, question, ...data } });
  }

  /** Preguntas que cuentan para el límite: las bloqueadas también, para evitar insistencia. */
  private countRecent(childId: string): Promise<number> {
    return this.prisma.aiQuestion.count({
      where: { childId, createdAt: { gte: new Date(Date.now() - DAY_MS) } },
    });
  }
}
