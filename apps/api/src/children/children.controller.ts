import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentChild } from '../common/decorators/current-child.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChildAccessGuard } from '../common/guards/child-access.guard';
import { PARENT_TOKEN_HEADER, ParentModeGuard } from '../common/guards/parent-mode.guard';
import type { AuthUser } from '../common/types/authenticated-request';
import type { Child } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChildrenService } from './children.service';
import { ChildSettingsDto, CreateChildDto, UpdateChildDto } from './dto/child.dto';

@ApiTags('children')
@ApiBearerAuth()
@Controller('children')
export class ChildrenController {
  constructor(
    private readonly children: ChildrenService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Perfiles de niños de la cuenta' })
  list(@CurrentUser() user: AuthUser) {
    return this.children.list(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un perfil (máximo 3 por cuenta)' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateChildDto) {
    return this.children.create(user.id, dto);
  }

  @Get(':childId')
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Detalle de un perfil' })
  get(@CurrentChild() child: Child) {
    return child;
  }

  @Patch(':childId')
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Actualiza nombre, avatar u otros datos del perfil' })
  update(@CurrentChild() child: Child, @Body() dto: UpdateChildDto) {
    return this.children.update(child, dto);
  }

  @Patch(':childId/settings')
  @UseGuards(ChildAccessGuard, ParentModeGuard)
  @ApiHeader({ name: PARENT_TOKEN_HEADER, required: true })
  @ApiOperation({
    summary: 'Ajustes de padres, p. ej. activar las preguntas a Lumi (requiere PIN)',
  })
  updateSettings(@CurrentChild() child: Child, @Body() dto: ChildSettingsDto) {
    return this.children.updateSettings(child, dto);
  }

  @Delete(':childId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ChildAccessGuard, ParentModeGuard)
  @ApiHeader({ name: PARENT_TOKEN_HEADER, required: true })
  @ApiOperation({ summary: 'Elimina un perfil y todo su progreso (requiere PIN)' })
  remove(@CurrentChild() child: Child) {
    return this.children.remove(child);
  }

  @Get(':childId/summary')
  @UseGuards(ChildAccessGuard, ParentModeGuard)
  @ApiHeader({ name: PARENT_TOKEN_HEADER, required: true })
  @ApiOperation({ summary: 'Resumen de progreso para la zona de padres (requiere PIN)' })
  summary(@CurrentChild() child: Child) {
    return this.children.summary(child);
  }

  @Get(':childId/stars')
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Saldo e historial reciente de estrellas' })
  async stars(@CurrentChild() child: Child) {
    const history = await this.prisma.starTransaction.findMany({
      where: { childId: child.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return { balance: child.stars, history };
  }
}
