import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { UpdateItineraryDto } from '../dto/update-itinerary.dto';
import { Itinerary } from '../entities/itinerary.entity';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
  ) {}
  create(createItineraryDto: CreateItineraryDto) {
    return this.itineraryRepository.save(createItineraryDto);
  }

  async findAll() {
    const itineraries = await this.itineraryRepository.find();
    return itineraries;
  }

  findOne(id: number) {
    return `This action returns a #${id} itinerary`;
  }

  update(id: number, updateItineraryDto: UpdateItineraryDto) {
    return `This action updates a #${id} itinerary`;
  }

  remove(id: number) {
    return `This action removes a #${id} itinerary`;
  }
}
