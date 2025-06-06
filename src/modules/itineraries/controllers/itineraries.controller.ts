import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';

import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { SearchItinerariesDto } from '../dto/search-itineraries.dto';
import { UpdateItineraryDto } from '../dto/update-itinerary.dto';
import { ItineraryOwnerGuard } from '../guards/itinerary-owner.guard';
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  findAll(@Query() searchDto: SearchItinerariesDto) {
    return this.itinerariesService.findAll(searchDto);
  }

  @Get(':itineraryId')
  findOne(@Param('itineraryId') itineraryId: string) {
    return this.itinerariesService.findOne(+itineraryId);
  }

  @Patch(':itineraryId')
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  update(
    @Param('itineraryId') itineraryId: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(+itineraryId, updateItineraryDto);
  }

  @Delete(':itineraryId')
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  remove(@Param('itineraryId') itineraryId: string) {
    return this.itinerariesService.remove(+itineraryId);
  }
}
