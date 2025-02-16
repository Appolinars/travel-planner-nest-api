import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';

import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { UpdateItineraryDto } from '../dto/update-itinerary.dto';
import { ItinerariesService } from '../services/itineraries.service';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: User,
    @Body() createItineraryDto: CreateItineraryDto,
  ) {
    return this.itinerariesService.create(createItineraryDto, user);
  }

  @Get()
  findAll() {
    return this.itinerariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itinerariesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(+id, updateItineraryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.itinerariesService.remove(+id);
  }
}
