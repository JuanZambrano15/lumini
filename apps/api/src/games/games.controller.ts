import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentChild } from '../common/decorators/current-child.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ChildAccessGuard } from '../common/guards/child-access.guard';
import type { Child } from '../generated/prisma/client';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller()
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Get('games')
  @Public()
  @ApiOperation({ summary: 'Catálogo de juegos por categoría' })
  list() {
    return this.games.list();
  }

  @Post('children/:childId/games/:slug/sessions')
  @ApiBearerAuth()
  @UseGuards(ChildAccessGuard)
  @ApiOperation({ summary: 'Registra una partida terminada y otorga estrellas' })
  recordSession(
    @CurrentChild() child: Child,
    @Param('slug') slug: string,
    @Body() dto: CreateGameSessionDto,
  ) {
    return this.games.recordSession(child, slug, dto);
  }
}
