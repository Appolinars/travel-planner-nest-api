import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

import { CreateItineraryMemberDto } from '../dto/create-itinerary-member.dto';
import { ItineraryMembersService } from '../services/itinerary-members.service';

@Controller('itinerary-members')
export class ItineraryMembersController {
  constructor(
    private readonly itineraryMembersService: ItineraryMembersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createItineraryMemberDto: CreateItineraryMemberDto) {
    return this.itineraryMembersService.create(createItineraryMemberDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.itineraryMembersService.remove(+id);
  }

  @Get(':id')
  getByItinerary(@Param('id') id: string) {
    return this.itineraryMembersService.findByItineraryId(+id);
  }
}
