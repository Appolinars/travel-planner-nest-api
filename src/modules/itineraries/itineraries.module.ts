import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from './entities/activity.entity';
import { Expense } from './entities/expense.entity';
import { Itinerary } from './entities/itinerary.entity';
import { UserToItinerary } from './entities/user-to-itinerary.entity';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Itinerary, Activity, Expense, UserToItinerary]),
  ],
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
})
export class ItinerariesModule {}
