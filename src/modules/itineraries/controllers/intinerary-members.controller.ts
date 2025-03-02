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
import { DeleteItineraryMemberDto } from '../dto/delete-itinerary-member.dto';
import { ItineraryOwnerGuard } from '../guards/itinerary-owner.guard';
import { ItineraryMembersService } from '../services/itinerary-members.service';

@Controller('itinerary-members')
export class ItineraryMembersController {
  constructor(
    private readonly itineraryMembersService: ItineraryMembersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  create(@Body() createItineraryMemberDto: CreateItineraryMemberDto) {
    return this.itineraryMembersService.create(createItineraryMemberDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  remove(@Body() { member_id }: DeleteItineraryMemberDto) {
    return this.itineraryMembersService.remove(member_id);
  }

  @Get(':id')
  getByItinerary(@Param('id') id: string) {
    return this.itineraryMembersService.findByItineraryId(+id);
  }
}
