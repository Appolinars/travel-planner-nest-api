import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';
import { IActivityResponse } from '../types/itineraries.types';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async create(payload: CreateActivityDto) {
    const query = `
      INSERT INTO activities (itinerary_id, title, description, date, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, date, location
    `;

    const values = [
      payload.itinerary_id,
      payload.title,
      payload.description || null,
      payload.date,
      payload.location,
    ];

    const result: IActivityResponse[] = await this.activitiesRepository.query(
      query,
      values,
    );
    return result[0];
  }

  async findByItineraryId(itinerary_id: number) {
    const query = `
      SELECT id, title, description, date, location
      FROM activities
      WHERE itinerary_id = $1
    `;

    const result: IActivityResponse[] = await this.activitiesRepository.query(
      query,
      [itinerary_id],
    );

    return result;
  }

  async remove(id: string) {
    const query = `
      DELETE FROM activities
      WHERE id = $1
    `;

    await this.activitiesRepository.query(query, [id]);
    return { success: true };
  }
}

// @Injectable()
// export class ActivitiesService {
//   constructor(
//     @InjectRepository(Activity)
//     private readonly activitiesRepository: Repository<Activity>,
//   ) {}

//   create(payload: CreateActivityDto) {
//     return this.activitiesRepository.save(payload);
//   }

//   findByItineraryId(itinerary_id: number) {
//     return this.activitiesRepository.find({
//       where: { itinerary_id },
//     });
//   }

//   async remove(id: string) {
//     await this.activitiesRepository.delete(id);
//     return { success: true };
//   }
// }
