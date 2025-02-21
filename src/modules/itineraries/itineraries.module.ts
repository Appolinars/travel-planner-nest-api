import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivitiesController } from './controllers/activities.controller';
import { ItineraryMembersController } from './controllers/intinerary-members.controller';
import { ItinerariesController } from './controllers/itineraries.controller';
import { Activity } from './entities/activity.entity';
import { Expense } from './entities/expense.entity';
import { Itinerary } from './entities/itinerary.entity';
import { ItineraryMember } from './entities/itinerary-member.entity';
import { ActivitiesService } from './services/activities.service';
import { ItinerariesService } from './services/itineraries.service';
import { ItineraryMembersService } from './services/itinerary-members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Itinerary, Activity, Expense, ItineraryMember]),
  ],
  controllers: [
    ItinerariesController,
    ItineraryMembersController,
    ActivitiesController,
  ],
  providers: [ItinerariesService, ItineraryMembersService, ActivitiesService],
})
export class ItinerariesModule {}
