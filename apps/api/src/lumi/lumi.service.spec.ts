import { ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env';
import type { Child } from '../generated/prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import { SAFE_MESSAGES } from './content-filter';
import type { LumiAiService } from './lumi-ai.service';
import { LumiService } from './lumi.service';

describe('LumiService', () => {
  const child = { id: 'c1', aiEnabled: true } as Child;
  const prisma = {
    $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn({})),
    aiQuestion: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn(({ data }: { data: object }) => Promise.resolve(data)),
    },
  };
  const stars = { spend: jest.fn(), award: jest.fn() };
  const ai = { isAvailable: jest.fn().mockReturnValue(true), answer: jest.fn() };
  const settings: Record<string, number> = { LUMI_QUESTION_COST: 5, LUMI_DAILY_LIMIT: 10 };
  const config = { get: jest.fn((key: string) => settings[key]) };

  const service = new LumiService(
    prisma as unknown as PrismaService,
    stars,
    ai as unknown as LumiAiService,
    config as unknown as ConfigService<Env, true>,
  );

  beforeEach(() => jest.clearAllMocks());

  it('exige que los padres activen la función', async () => {
    await expect(
      service.ask({ ...child, aiEnabled: false }, '¿Qué es la luna?'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(ai.answer).not.toHaveBeenCalled();
  });

  it('respeta el límite diario', async () => {
    prisma.aiQuestion.count.mockResolvedValueOnce(10);
    await expect(service.ask(child, '¿Qué es la luna?')).rejects.toThrow('muchas preguntas');
  });

  it('bloquea datos personales sin llamar a la IA ni cobrar', async () => {
    const result = await service.ask(child, 'mi teléfono es 3001234567');

    expect(result).toMatchObject({ status: 'BLOCKED', reason: 'personal_info', starsSpent: 0 });
    expect(ai.answer).not.toHaveBeenCalled();
    expect(stars.spend).not.toHaveBeenCalled();
  });

  it('cobra y guarda la respuesta de la IA', async () => {
    ai.answer.mockResolvedValue({
      safe: true,
      category: 'ok',
      answer: 'Porque la luz se dispersa ☀️',
    });

    const result = await service.ask(child, '¿Por qué el cielo es azul?');

    expect(stars.spend).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ amount: 5, reason: 'AI_QUESTION' }),
    );
    expect(result).toMatchObject({ status: 'ANSWERED', answer: 'Porque la luz se dispersa ☀️' });
  });

  it('reemplaza la respuesta de la IA cuando marca la pregunta como no segura', async () => {
    ai.answer.mockResolvedValue({ safe: false, category: 'self_harm', answer: 'texto de la IA' });

    const result = await service.ask(child, 'me siento muy triste');

    expect(result).toMatchObject({ status: 'REDIRECTED', answer: SAFE_MESSAGES.self_harm });
  });

  it('devuelve las estrellas si la IA falla', async () => {
    ai.answer.mockRejectedValue(new ServiceUnavailableException());

    await expect(service.ask(child, '¿Qué es un volcán?')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(stars.award).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ amount: 5, reason: 'AI_REFUND' }),
    );
  });
});
