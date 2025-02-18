import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItineraryMemberDto } from '../dto/create-itinerary-member.dto';
import { ItineraryMember } from '../entities/itinerary-member.entity';

@Injectable()
export class ItineraryMembersService {
  constructor(
    @InjectRepository(ItineraryMember)
    private readonly membersRepository: Repository<ItineraryMember>,
  ) {}

  async create({ user_id, itinerary_id }: CreateItineraryMemberDto) {
    const memberExists = await this.membersRepository.findOne({
      where: {
        user_id,
        itinerary_id,
      },
    });

    if (memberExists) {
      throw new BadRequestException('Member already exists');
    }

    const member = await this.membersRepository.save({ user_id, itinerary_id });

    const fullMember = await this.membersRepository.findOne({
      where: { id: member.id },
      relations: ['user'],
    });

    return fullMember;
  }

  async remove(id: number) {
    await this.membersRepository.delete(id);
    return { success: true };
  }

  async findByItineraryId(itinerary_id: number) {
    return this.membersRepository.find({
      where: { itinerary_id },
      relations: ['user'],
    });
  }
}
