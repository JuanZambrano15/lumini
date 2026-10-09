import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Env } from '../config/env';
import type { AccessTokenPayload } from '../common/types/authenticated-request';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { generateOpaqueToken, hashToken } from './token-hash';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult extends AuthTokens {
  user: { id: string; email: string; name: string | null };
}

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Ya existe una cuenta con ese email');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name?.trim() || null,
        passwordHash: await argon2.hash(dto.password),
      },
    });

    return { user: this.toPublicUser(user), ...(await this.issueTokens(user.id, user.email)) };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Mismo mensaje para email inexistente y contraseña errónea: no revela qué cuentas existen.
    const valid = user ? await argon2.verify(user.passwordHash, dto.password) : false;
    if (!user || !valid) throw new UnauthorizedException('Email o contraseña incorrectos');

    return { user: this.toPublicUser(user), ...(await this.issueTokens(user.id, user.email)) };
  }

  /**
   * Rota el refresh token: el usado se revoca y se emite uno nuevo.
   * Si llega un token ya revocado, asumimos que fue robado y cerramos todas
   * las sesiones del usuario (detección de reutilización).
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sesión expirada, inicia sesión de nuevo');
    }

    if (stored.revokedAt) {
      await this.revokeAllForUser(stored.userId);
      throw new UnauthorizedException('Sesión inválida, inicia sesión de nuevo');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id, stored.user.email);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(userId: string, email: string): Promise<AuthTokens> {
    const expiresIn = this.config.get('JWT_ACCESS_TTL_SECONDS', { infer: true });
    const payload: AccessTokenPayload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn });

    const refreshToken = generateOpaqueToken();
    const ttlDays = this.config.get('REFRESH_TOKEN_TTL_DAYS', { infer: true });
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + ttlDays * DAY_MS),
      },
    });

    return { accessToken, refreshToken, expiresIn };
  }

  private toPublicUser(user: { id: string; email: string; name: string | null }) {
    return { id: user.id, email: user.email, name: user.name };
  }
}
