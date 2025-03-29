import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/configuration';
import { IAppConfig } from './config/configuration.interface';
import { AuthModule } from './modules/auth/auth.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { UsersModule } from './modules/users/users.module';
import { PdfModule } from './pdf/pdf.module';

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
        port: +configService.get('PG_DB_PASSWORD'),
        username: configService.get('PG_DB_USERNAME'),
        password: configService.get('PG_DB_PASSWORD'),
        database: configService.get('PG_DB_DATABASE'),
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
        useUTC: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IAppConfig>) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService<IAppConfig>) => ({
        stores: [
          createKeyv({
            url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
          }),
        ],
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ItinerariesModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
