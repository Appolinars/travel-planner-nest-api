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

import { CreateActivityDto } from '../dto/create-activity.dto';
import { DeleteActivityDto } from '../dto/delete-activity.dto';
import { ItineraryOwnerGuard } from '../guards/itinerary-owner.guard';
import { ActivitiesService } from '../services/activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get(':id')
  async findByItineraryId(@Param('id') id: string) {
    return this.activitiesService.findByItineraryId(+id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  async remove(@Body() { activity_id }: DeleteActivityDto) {
    return this.activitiesService.remove(activity_id);
  }
}
