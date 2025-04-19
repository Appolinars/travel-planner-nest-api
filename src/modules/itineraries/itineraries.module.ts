// import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivitiesController } from './controllers/activities.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { FavoritesController } from './controllers/favorites-itineraries.controller';
import { ItineraryMembersController } from './controllers/intinerary-members.controller';
import { ItinerariesController } from './controllers/itineraries.controller';
import { Activity } from './entities/activity.entity';
import { Expense } from './entities/expense.entity';
import { FavoriteItinerary } from './entities/favorite-itinerary.entity';
import { Itinerary } from './entities/itinerary.entity';
import { ItineraryMember } from './entities/itinerary-member.entity';
import { ActivitiesService } from './services/activities.service';
import { ExpensesService } from './services/expenses.service';
import { FavoritesService } from './services/favorite-itineraries.service';
import { ItinerariesService } from './services/itineraries.service';
import { ItinerariesCronService } from './services/itineraries-cron.service';
import { ItineraryMembersService } from './services/itinerary-members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Itinerary,
      Activity,
      Expense,
      ItineraryMember,
      FavoriteItinerary,
    ]),
    ClientsModule.register([
      {
        name: 'ITINERARY_NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'itineraries-notifications-queue',
          // routingKey: 'email',
          // exchange: 'itinerary_notifications',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
        },
      },
    ]),
    // RabbitMQModule.forRoot({
    //   exchanges: [
    //     {
    //       name: 'itinerary_notifications',
    //       type: 'direct',
    //     },
    //   ],
    //   uri: 'amqp://guest:guest@localhost:5672',
    //   connectionInitOptions: { wait: false },
    // }),
  ],
  controllers: [
    ItinerariesController,
    ItineraryMembersController,
    ActivitiesController,
    ExpensesController,
    FavoritesController,
  ],
  providers: [
    ItinerariesService,
    ItineraryMembersService,
    ActivitiesService,
    ExpensesService,
    FavoritesService,
    ItinerariesCronService,
  ],
  exports: [ItinerariesService, ActivitiesService, ExpensesService],
})
export class ItinerariesModule {}
