import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { IPaginatedResponse } from 'src/shared/types/filters.types';
import { DataSource } from 'typeorm';

import { SearchItinerariesDto } from '../dto/search-itineraries.dto';
import {
  EItineraryMemberRole,
  IItineraryResponse,
} from '../types/itineraries.types';
import { ItineraryQueryBuilder } from './itinerary-query-builder';

@Injectable()
export class FavoritesService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addToFavorites(itineraryId: number, user: User) {
    const existsQuery = `
      SELECT 1 
      FROM favorite_itineraries 
      WHERE user_id = $1 AND itinerary_id = $2
    `;
    const exists = await this.dataSource.query(existsQuery, [
      user.id,
      itineraryId,
    ]);

    if (exists.length > 0) {
      throw new BadRequestException('Favorite already exists');
    }

    const insertQuery = `
      INSERT INTO favorite_itineraries (user_id, itinerary_id)
      VALUES ($1, $2)
    `;
    await this.dataSource.query(insertQuery, [user.id, itineraryId]);

    return { success: true };
  }

  async removeFromFavorites(itineraryId: number, user: User) {
    const deleteQuery = `
      DELETE FROM favorite_itineraries 
      WHERE user_id = $1 AND itinerary_id = $2
    `;
    const result = await this.dataSource.query(deleteQuery, [
      user.id,
      itineraryId,
    ]);

    if (result[1] === 0) {
      throw new NotFoundException('Favorite not found');
    }

    return { success: true };
  }

  async findAll(
    user: User,
    searchDto: SearchItinerariesDto,
  ): Promise<IPaginatedResponse<IItineraryResponse[]>> {
    const baseQuery = `
      SELECT 
        i.*,
        im.role,
        u.id as user_id,
        u.username,
        u.email,
        u.avatar
      FROM itineraries i
      INNER JOIN favorite_itineraries fi ON fi.itinerary_id = i.id AND fi.user_id = $1
      LEFT JOIN itinerary_members im ON im.itinerary_id = i.id AND im.role = $2
      LEFT JOIN users u ON u.id = im.user_id
    `;

    const queryBuilder = new ItineraryQueryBuilder(
      this.dataSource,
      {
        baseQuery,
        initialParams: [user.id, EItineraryMemberRole.OWNER],
      },
      searchDto,
    );

    return queryBuilder.execute();
  }
}
