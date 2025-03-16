import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';

import { SearchItinerariesDto } from '../dto/search-itineraries.dto';
import { FavoritesService } from '../services/favorite-itineraries.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':itineraryId')
  addToFavorites(
    @Param('itineraryId') itineraryId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.addToFavorites(+itineraryId, user);
  }

  @Delete(':itineraryId')
  removeFromFavorites(
    @Param('itineraryId') itineraryId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.removeFromFavorites(+itineraryId, user);
  }

  @Get()
  findAllFavorites(
    @CurrentUser() user: User,
    @Query() searchDto: SearchItinerariesDto,
  ) {
    return this.favoritesService.findAll(user, searchDto);
  }
}
