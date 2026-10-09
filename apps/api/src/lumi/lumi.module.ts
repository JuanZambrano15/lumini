import { Module } from '@nestjs/common';
import { LumiAiService } from './lumi-ai.service';
import { LumiController } from './lumi.controller';
import { LumiService } from './lumi.service';

@Module({
  controllers: [LumiController],
  providers: [LumiService, LumiAiService],
})
export class LumiModule {}
