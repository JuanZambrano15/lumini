import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentChild } from '../common/decorators/current-child.decorator';
import { ChildAccessGuard } from '../common/guards/child-access.guard';
import type { Child } from '../generated/prisma/client';
import { AskQuestionDto } from './dto/ask-question.dto';
import { LumiService } from './lumi.service';

@ApiTags('lumi')
@ApiBearerAuth()
@UseGuards(ChildAccessGuard)
@Controller('children/:childId/lumi')
export class LumiController {
  constructor(private readonly lumi: LumiService) {}

  @Get()
  @ApiOperation({ summary: 'Si Lumi está activo, su costo y las preguntas restantes hoy' })
  status(@CurrentChild() child: Child) {
    return this.lumi.status(child);
  }

  @Get('questions')
  @ApiOperation({ summary: 'Historial de preguntas (también lo revisan los padres)' })
  history(@CurrentChild() child: Child) {
    return this.lumi.history(child);
  }

  @Post('questions')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Lanza estrellas al pozo para hacerle una pregunta a Lumi' })
  ask(@CurrentChild() child: Child, @Body() dto: AskQuestionDto) {
    return this.lumi.ask(child, dto.question);
  }
}
