import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'gpt-tokenizer/cjs/GptEncoding';
import { OpenAIService } from 'src/shared/modules/openai/openai.service';
import { Repository } from 'typeorm';

import { ActivitiesService } from '../itineraries/services/activities.service';
import { ExpensesService } from '../itineraries/services/expenses.service';
import { ItinerariesService } from '../itineraries/services/itineraries.service';
import { User } from '../users/entities/user.entity';
import { ItineraryMessageDto } from './dto/itinerary-message.dto';
import { ItineraryConversation } from './entities/itinerary-conversation.entity';
import { ItineraryMessage } from './entities/itinerary-message.entity';
import { generateItineraryAssistantPrompt } from './promts/itinerary-assistant.promt';

@Injectable()
export class AssistantService {
  constructor(
    private readonly openai: OpenAIService,
    private readonly itinerariesService: ItinerariesService,
    private readonly expensesService: ExpensesService,
    private readonly activitiesService: ActivitiesService,
    @InjectRepository(ItineraryConversation)
    private readonly itineraryConversationRepository: Repository<ItineraryConversation>,
    @InjectRepository(ItineraryMessage)
    private readonly itineraryMessageRepository: Repository<ItineraryMessage>,
  ) {}

  async sendItineraryMessage(
    payload: ItineraryMessageDto,
    itineraryId: number,
    user: User,
  ) {
    let conversationId: number;
    const conversation = await this.findItineraryConversation(
      itineraryId,
      user,
    );

    if (!conversation) {
      conversationId = await this.createItineraryConversation(
        itineraryId,
        user,
      );
    } else {
      conversationId = conversation.id;
    }

    await this.createItineraryMessage(conversationId, payload.message, true);

    const userMessages: ChatMessage[] = conversation?.messages
      ? [...conversation.messages]
          .slice(-20) // Take only the 20 most recent messages
          .map((m) => {
            const message: ChatMessage = {
              role: m.is_user ? 'user' : 'assistant',
              content: m.content,
            };
            return message;
          })
      : [];

    userMessages.push({
      role: 'user',
      content: payload.message,
    });

    const itinerary = await this.itinerariesService.findOne(itineraryId);
    const activities =
      await this.activitiesService.findByItineraryId(itineraryId);
    const expenses = await this.expensesService.findByItineraryId(itineraryId);

    const prompt = generateItineraryAssistantPrompt({
      itinerary,
      activities,
      expenses,
    });

    const openaiResponse = await this.openai.sendNonStreaming(userMessages, {
      role: 'assistant',
      content: prompt,
    });

    const assistantMessage = openaiResponse.choices?.[0]?.message?.content;

    if (assistantMessage) {
      await this.createItineraryMessage(
        conversationId,
        assistantMessage,
        false,
      );
    }

    return assistantMessage;
  }

  private async createItineraryMessage(
    conversationId: number,
    content: string,
    isUser: boolean,
  ) {
    const query = `
      INSERT INTO itinerary_messages (conversation_id, content, is_user)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [conversationId, content, isUser];
    const result = await this.itineraryMessageRepository.query(query, values);
    if (!result[0]) {
      throw new BadRequestException('Failed to create itinerary message');
    }
  }

  private async createItineraryConversation(itineraryId: number, user: User) {
    const query = `
      INSERT INTO itinerary_conversations (user_id, itinerary_id)
      VALUES ($1, $2)
      RETURNING id
    `;
    const values = [user.id, itineraryId];
    const result: { id: number }[] =
      await this.itineraryConversationRepository.query(query, values);
    console.log('createItineraryConversation result', result);

    if (!result[0]) {
      throw new BadRequestException('Failed to create itinerary conversation');
    }

    return result[0].id;
  }

  private async findItineraryConversation(itineraryId: number, user: User) {
    const query = `
    SELECT 
      ic.id,
      json_agg(
        json_build_object(
          'content', im.content,
          'is_user', im.is_user
        )
      ) as messages
    FROM 
      itinerary_conversations ic
    LEFT JOIN 
      itinerary_messages im ON ic.id = im.conversation_id
    WHERE 
      ic.user_id = $1 AND ic.itinerary_id = $2
    GROUP BY 
      ic.id
    `;

    const result: {
      id: number;
      messages: { content: string; is_user: boolean }[];
    }[] = await this.itineraryConversationRepository.query(query, [
      user.id,
      itineraryId,
    ]);
    console.log('findItineraryConversation result', result);
    return result[0];
  }
}
