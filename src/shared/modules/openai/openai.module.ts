import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IAppConfig } from 'src/config/configuration.interface';

import { BottleneckModule } from '../bottleneck/bottleneck.module';
import { OpenAIService } from './openai.service';

@Module({
  providers: [
    OpenAIService,
    {
      provide: 'OpenAI',
      useFactory: (configService: ConfigService<IAppConfig>) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [OpenAIService],
  imports: [BottleneckModule],
})
export class OpenAIModule {}
