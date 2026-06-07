// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { Itinerary } from '../entities/itinerary.entity';

@Injectable()
export class ItinerariesCronService {
  constructor(
    @InjectRepository(Itinerary)
    private itineraryRepository: Repository<Itinerary>,
    // private readonly amqpConnection: AmqpConnection,
    @Inject('ITINERARY_NOTIFICATIONS_SERVICE')
    private rabbitClient: ClientProxy,
    @InjectPinoLogger(ItinerariesCronService.name)
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async checkItineraries() {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0, 0);

    const itineraries = await this.itineraryRepository.find({
      //   where: {
      //     start_date: threeDaysFromNow,
      //   },
      relations: ['members', 'members.user'],
    });

    for (const itinerary of itineraries) {
      for (const member of itinerary.members) {
        const user = member.user;
        // One correlation id per published message — the mailing service logs
        // the same id, so a reminder can be traced across both apps.
        const correlationId = randomUUID();
        this.logger.info(
          { correlationId, userId: user.id, itineraryId: itinerary.id },
          'Publishing itinerary reminder',
        );
        this.rabbitClient
          .emit('itinerary_start_reminder', {
            correlationId,
            userId: user.id,
            email: 'vakulenko.maksim977@gmail.com',
            username: user.username,
            itineraryId: itinerary.id,
            itineraryTitle: itinerary.title,
            startDate: itinerary.start_date,
          })
          .subscribe();
        // await this.amqpConnection.publish(
        //   'itinerary_notifications', // Exchange
        //   'email', // Routing key
        //   {
        //     userId: user.id,
        //     email: 'vakulenko.maksim977@gmail.com',
        //     username: user.username,
        //     itineraryId: itinerary.id,
        //     itineraryTitle: itinerary.title,
        //     startDate: itinerary.start_date,
        //   },
        // );
      }
    }
  }
}
