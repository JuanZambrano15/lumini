import { Module } from '@nestjs/common';
import { ChildLearningController, LearningCatalogController } from './learning.controller';
import { LearningService } from './learning.service';

@Module({
  controllers: [LearningCatalogController, ChildLearningController],
  providers: [LearningService],
})
export class LearningModule {}
