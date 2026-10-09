import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Child } from '../../generated/prisma/client';
import type { AuthenticatedRequest } from '../types/authenticated-request';

/**
 * Inyecta el perfil de niño cargado por ChildAccessGuard.
 * Usarlo sin el guard es un error de programación, por eso lanza 500.
 */
export const CurrentChild = createParamDecorator((_data: unknown, ctx: ExecutionContext): Child => {
  const child = ctx.switchToHttp().getRequest<AuthenticatedRequest>().child;
  if (!child) {
    throw new InternalServerErrorException('ChildAccessGuard no se aplicó a esta ruta');
  }
  return child;
});
