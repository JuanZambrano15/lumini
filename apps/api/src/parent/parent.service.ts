import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Env } from '../config/env';
import type { ParentTokenPayload } from '../common/types/authenticated-request';
import { PrismaService } from '../prisma/prisma.service';

export interface ParentSession {
  parentToken: string;
  expiresIn: number;
}

@Injectable()
export class ParentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  /** Crea o cambia el PIN. Para cambiarlo hay que conocer el actual. */
  async setPin(userId: string, pin: string, currentPin?: string): Promise<ParentSession> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (user.parentPinHash) {
      if (!currentPin) throw new BadRequestException('Ingresa tu PIN actual para cambiarlo');
      if (!(await argon2.verify(user.parentPinHash, currentPin))) {
        throw new ForbiddenException('El PIN actual no es correcto');
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { parentPinHash: await argon2.hash(pin) },
    });
    return this.createSession(userId);
  }

  /** Verifica el PIN (en el servidor, nunca en el cliente) y abre una sesión de padres. */
  async verifyPin(userId: string, pin: string): Promise<ParentSession> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.parentPinHash) throw new BadRequestException('Aún no has configurado un PIN');
    if (!(await argon2.verify(user.parentPinHash, pin))) {
      throw new ForbiddenException('PIN incorrecto');
    }
    return this.createSession(userId);
  }

  private async createSession(userId: string): Promise<ParentSession> {
    const expiresIn = this.config.get('PARENT_SESSION_TTL_SECONDS', { infer: true });
    const payload: ParentTokenPayload = { sub: userId, scope: 'parent' };
    const parentToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_PARENT_SECRET', { infer: true }),
      expiresIn,
    });
    return { parentToken, expiresIn };
  }
}
