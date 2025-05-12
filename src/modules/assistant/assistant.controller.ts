import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AssistantService } from './assistant.service';
import { ItineraryMessageDto } from './dto/itinerary-message.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/itinerary/:itineraryId')
  async sendItineraryMessage(
    @Body() payload: ItineraryMessageDto,
    @Param('itineraryId') itineraryId: string,
    @CurrentUser() user: User,
  ) {
    return this.assistantService.sendItineraryMessage(
      payload,
      +itineraryId,
      user,
    );
  }
}
