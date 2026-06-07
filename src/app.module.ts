import { createKeyv, Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheableMemory } from 'cacheable';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/configuration';
import { IAppConfig } from './config/configuration.interface';
import { AssistantModule } from './modules/assistant/assistant.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { TwitterModule } from './modules/twitter/twitter.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IAppConfig>) => ({
        type: 'postgres',
        host: configService.get('PG_DB_HOST'),
        port: +configService.get('PG_DB_PORT'),
        username: configService.get('PG_DB_USERNAME'),
        password: configService.get('PG_DB_PASSWORD'),
        database: configService.get('PG_DB_DATABASE'),
        synchronize: false,
        autoLoadEntities: true,
        logging: configService.get('NODE_ENV') !== 'production',
        useUTC: true,
      }),
      inject: [ConfigService],
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService<IAppConfig>) => ({
    //     uri: configService.get('MONGO_URI'),
    //     dbName: configService.get('MONGO_DB_NAME'),
    //   }),
    //   inject: [ConfigService],
    // }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IAppConfig>) => ({
        stores: [
          createKeyv({
            url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
            socket: {
              connectTimeout: 5000,
              reconnectStrategy: (retries) =>
                retries > 5 ? new Error('Redis unavailable') : 200,
            },
          }),
          new Keyv({ store: new CacheableMemory() }),
        ],
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IAppConfig>) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
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
    ScheduleModule.forRoot(),
    HealthModule,
    UsersModule,
    AuthModule,
    ItinerariesModule,
    PdfModule,
    AssistantModule,
    TwitterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
