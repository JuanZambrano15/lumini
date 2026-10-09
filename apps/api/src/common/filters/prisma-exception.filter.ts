import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

/**
 * Traduce errores conocidos de Prisma a respuestas HTTP coherentes
 * en vez de devolver un 500 genérico.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const mapping: Record<string, { status: number; message: string }> = {
      P2002: { status: HttpStatus.CONFLICT, message: 'El recurso ya existe' },
      P2003: { status: HttpStatus.BAD_REQUEST, message: 'Referencia inválida' },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'Recurso no encontrado' },
    };
    const known = mapping[exception.code];

    if (!known) {
      this.logger.error(`Error de Prisma no controlado (${exception.code})`, exception.stack);
    }

    const status = known?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: known?.message ?? 'Error interno del servidor',
    });
  }
}
