import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenAIModule } from 'src/shared/modules/openai/openai.module';

import { ItinerariesModule } from '../itineraries/itineraries.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { ItineraryConversation } from './entities/itinerary-conversation.entity';
import { ItineraryMessage } from './entities/itinerary-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItineraryConversation, ItineraryMessage]),
    ItinerariesModule,
    OpenAIModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
