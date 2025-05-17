import { Module } from '@nestjs/common';

import { ItinerariesModule } from '../itineraries/itineraries.module';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  providers: [TwitterService],
  controllers: [TwitterController],
  imports: [ItinerariesModule],
})
export class TwitterModule {}
