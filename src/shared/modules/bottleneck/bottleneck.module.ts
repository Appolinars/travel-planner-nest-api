import { Module } from '@nestjs/common';

import { BottleneckService } from './bottleneck.service';

@Module({
  providers: [BottleneckService],
  exports: [BottleneckService],
})
export class BottleneckModule {}
