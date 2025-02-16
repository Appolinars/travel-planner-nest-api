import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { UpdateItineraryDto } from '../dto/update-itinerary.dto';
import { Itinerary } from '../entities/itinerary.entity';
import { ItineraryMember } from '../entities/itinerary-member.entity';
import {
  EItineraryUserRole,
  IItineraryResponse,
} from '../types/itineraries.types';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    @InjectRepository(ItineraryMember)
    private dataSource: DataSource,
  ) {}

  async create(createItineraryDto: CreateItineraryDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const itinerary = await queryRunner.manager.save(
        Itinerary,
        createItineraryDto,
      );

      const itineraryOwner = await queryRunner.manager.save(ItineraryMember, {
        itinerary_id: itinerary.id,
        user_id: user.id,
        role: EItineraryUserRole.OWNER,
      });

      const itineraryOwnerWithUser = await queryRunner.manager.findOne(
        ItineraryMember,
        {
          where: { id: itineraryOwner.id },
          relations: ['user'],
        },
      );

      await queryRunner.commitTransaction();
      return { ...itinerary, owner: itineraryOwnerWithUser };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      new BadRequestException('Error creating itinerary');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<IItineraryResponse[]> {
    const itineraries = await this.itineraryRepository
      .createQueryBuilder('itinerary')
      .leftJoinAndSelect('itinerary.members', 'member', 'member.role = :role', {
        role: EItineraryUserRole.OWNER,
      })
      .leftJoinAndSelect('member.user', 'user')
      .getMany();

    const mappedItineraries = itineraries.map((itinerary) => {
      const owner = itinerary.members[0];
      delete itinerary.members;
      return {
        ...itinerary,
        owner,
      };
    });

    return mappedItineraries;
  }

  async findOne(id: number): Promise<IItineraryResponse> {
    const itinerary = await this.itineraryRepository
      .createQueryBuilder('itinerary')
      .leftJoinAndSelect('itinerary.members', 'member', 'member.role = :role', {
        role: EItineraryUserRole.OWNER,
      })
      .leftJoinAndSelect('member.user', 'user')
      .where('itinerary.id = :id', { id })
      .getOne();

    if (!itinerary) {
      new NotFoundException('Itinerary not found');
    }

    const owner = itinerary.members[0];
    delete itinerary.members;
    return {
      ...itinerary,
      owner,
    };
  }

  async update(
    id: number,
    updateItineraryDto: UpdateItineraryDto,
  ): Promise<IItineraryResponse> {
    const itinerary = await this.findOne(id);

    Object.assign(itinerary, updateItineraryDto);

    const updatedItinerary = await this.itineraryRepository.save(itinerary);
    return updatedItinerary;
  }

  async remove(id: number) {
    await this.itineraryRepository.delete(id);
    return { success: true };
  }
}
