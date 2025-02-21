import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateActivityDto } from '../dto/create-activity.dto';
import { Activity } from '../entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  create(payload: CreateActivityDto) {
    return this.activitiesRepository.save(payload);
  }

  findByItineraryId(itinerary_id: number) {
    return this.activitiesRepository.find({
      where: { itinerary_id },
    });
  }

  async remove(id: string) {
    await this.activitiesRepository.delete(id);
    return { success: true };
  }
}
