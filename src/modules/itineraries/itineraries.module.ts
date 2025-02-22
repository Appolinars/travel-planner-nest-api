import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivitiesController } from './controllers/activities.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { ItineraryMembersController } from './controllers/intinerary-members.controller';
import { ItinerariesController } from './controllers/itineraries.controller';
import { Activity } from './entities/activity.entity';
import { Expense } from './entities/expense.entity';
import { Itinerary } from './entities/itinerary.entity';
import { ItineraryMember } from './entities/itinerary-member.entity';
import { ActivitiesService } from './services/activities.service';
import { ExpensesService } from './services/expenses.service';
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
    ExpensesController,
  ],
  providers: [
    ItinerariesService,
    ItineraryMembersService,
    ActivitiesService,
    ExpensesService,
  ],
})
export class ItinerariesModule {}
