import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentChild } from '../common/decorators/current-child.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ChildAccessGuard } from '../common/guards/child-access.guard';
import type { Child } from '../generated/prisma/client';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { LearningService } from './learning.service';

@ApiTags('learning')
@Public()
@Controller()
export class LearningCatalogController {
  constructor(private readonly learning: LearningService) {}

  @Get('topics')
  @ApiOperation({ summary: 'Temas con sus actividades' })
  listTopics() {
    return this.learning.listTopics();
  }

  @Get('topics/:slug')
  @ApiOperation({ summary: 'Detalle de un tema con su tutorial' })
  getTopic(@Param('slug') slug: string) {
    return this.learning.getTopic(slug);
  }

  @Get('activities/:activityId')
  @ApiOperation({ summary: 'Preguntas de una actividad (sin respuestas)' })
  getActivity(@Param('activityId', ParseIntPipe) activityId: number) {
    return this.learning.getActivity(activityId);
  }
}

@ApiTags('learning')
@ApiBearerAuth()
@UseGuards(ChildAccessGuard)
@Controller('children/:childId')
export class ChildLearningController {
  constructor(private readonly learning: LearningService) {}

  @Get('progress')
  @ApiOperation({ summary: 'Mejor resultado del niño en cada actividad' })
  progress(@CurrentChild() child: Child) {
    return this.learning.progress(child);
  }

  @Post('activities/:activityId/attempts')
  @ApiOperation({
    summary: 'Envía las respuestas; se califican en el servidor y se otorgan estrellas',
  })
  submit(
    @CurrentChild() child: Child,
    @Param('activityId', ParseIntPipe) activityId: number,
    @Body() dto: SubmitAttemptDto,
  ) {
    return this.learning.submitAttempt(child, activityId, dto.answers);
  }
}
