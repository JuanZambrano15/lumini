import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedRequest } from '../types/authenticated-request';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Verifica que el :childId de la ruta pertenezca al usuario autenticado y deja
 * el perfil disponible vía @CurrentChild(). Responde 404 (y no 403) para no
 * revelar si existe un perfil de otra familia.
 */
@Injectable()
export class ChildAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const childId = request.params.childId;

    if (typeof childId !== 'string' || !UUID_PATTERN.test(childId)) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const child = await this.prisma.child.findFirst({
      where: { id: childId, userId: request.user.id },
    });
    if (!child) throw new NotFoundException('Perfil no encontrado');

    request.child = child;
    return true;
  }
}
