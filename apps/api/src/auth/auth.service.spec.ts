import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Env } from '../config/env';
import type { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { hashToken } from './token-hash';

describe('AuthService', () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
    refreshToken: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('access-token') };
  const config = { get: jest.fn((key: string) => (key === 'REFRESH_TOKEN_TTL_DAYS' ? 7 : 900)) };

  const service = new AuthService(
    prisma as unknown as PrismaService,
    jwt as unknown as JwtService,
    config as unknown as ConfigService<Env, true>,
  );

  beforeEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('devuelve tokens con credenciales correctas', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@b.co',
        name: null,
        passwordHash: await argon2.hash('secreto123'),
      });

      const result = await service.login({ email: 'a@b.co', password: 'secreto123' });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toHaveLength(64);
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });

    it('usa el mismo error para email inexistente y contraseña errónea', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'x@y.co', password: 'nada' })).rejects.toThrow(
        'Email o contraseña incorrectos',
      );
    });
  });

  describe('refresh', () => {
    const user = { id: 'u1', email: 'a@b.co' };

    it('rota el token: revoca el usado y emite uno nuevo', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        user,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });

      const tokens = await service.refresh('token-original');

      expect(prisma.refreshToken.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { tokenHash: hashToken('token-original') } }),
      );
      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'rt1' },
        data: { revokedAt: expect.any(Date) },
      });
      expect(tokens.refreshToken).not.toBe('token-original');
    });

    it('si se reutiliza un token revocado cierra todas las sesiones', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        user,
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      });

      await expect(service.refresh('robado')).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('rechaza tokens expirados', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        user,
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1),
      });
      await expect(service.refresh('viejo')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
