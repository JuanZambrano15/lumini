import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Env } from '../../config/env';
import type { AuthenticatedRequest, ParentTokenPayload } from '../types/authenticated-request';

export const PARENT_TOKEN_HEADER = 'x-parent-token';

/**
 * Protege las acciones de la zona de padres (gestionar deseos, ver estadísticas,
 * borrar perfiles). Además del access token, exige un token de corta duración que
 * solo se obtiene ingresando el PIN de padres. Así un niño con la sesión abierta
 * no puede entrar a esa zona.
 */
@Injectable()
export class ParentModeGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers[PARENT_TOKEN_HEADER];
    if (typeof token !== 'string' || !token) {
      throw new ForbiddenException('Se requiere el PIN de padres');
    }

    let payload: ParentTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<ParentTokenPayload>(token, {
        secret: this.config.get('JWT_PARENT_SECRET', { infer: true }),
      });
    } catch {
      throw new ForbiddenException('La sesión de padres expiró, ingresa el PIN de nuevo');
    }

    if (payload.scope !== 'parent' || payload.sub !== request.user.id) {
      throw new ForbiddenException('Se requiere el PIN de padres');
    }
    return true;
  }
}
