import { Global, Module } from '@nestjs/common';
import { StarsService } from './stars.service';

@Global()
@Module({
  providers: [StarsService],
  exports: [StarsService],
})
export class StarsModule {}
