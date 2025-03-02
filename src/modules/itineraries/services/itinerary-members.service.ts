import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItineraryMemberDto } from '../dto/create-itinerary-member.dto';
import { ItineraryMember } from '../entities/itinerary-member.entity';
import { EItineraryMemberRole, IRawMember } from '../types/itineraries.types';

@Injectable()
export class ItineraryMembersService {
  constructor(
    @InjectRepository(ItineraryMember)
    private readonly membersRepository: Repository<ItineraryMember>,
  ) {}

  async create({ user_id, itinerary_id, role }: CreateItineraryMemberDto) {
    const existsQuery = `
      SELECT id
      FROM itinerary_members
      WHERE user_id = $1 AND itinerary_id = $2
      LIMIT 1
    `;
    const existsResult = await this.membersRepository.query(existsQuery, [
      user_id,
      itinerary_id,
    ]);

    if (existsResult.length > 0) {
      throw new BadRequestException('Member already exists');
    }

    const insertQuery = `
      INSERT INTO itinerary_members (user_id, itinerary_id, role)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, role
    `;
    const insertValues = [
      user_id,
      itinerary_id,
      role || EItineraryMemberRole.MEMBER,
    ];
    const insertResult = await this.membersRepository.query(
      insertQuery,
      insertValues,
    );
    const newMember = insertResult[0];

    const selectQuery = `
      SELECT 
        im.id,
        im.user_id,
        im.role,
        u.id AS user_id,
        u.username AS user_username,
        u.email AS user_email,
        u.avatar AS user_avatar
      FROM itinerary_members im
      LEFT JOIN users u ON u.id = im.user_id
      WHERE im.id = $1
    `;
    const fullMemberResult = await this.membersRepository.query(selectQuery, [
      newMember.id,
    ]);

    return this.transformMember(fullMemberResult[0]);
  }

  async remove(id: number) {
    const query = `
      DELETE FROM itinerary_members
      WHERE id = $1
    `;

    await this.membersRepository.query(query, [id]);
    return { success: true };
  }

  async findByItineraryId(itinerary_id: number) {
    const query = `
    SELECT 
      im.id,
      im.user_id,
      im.role,
      u.id AS user_id,
      u.username AS user_username,
      u.email AS user_email,
      u.avatar AS user_avatar
    FROM itinerary_members im
    LEFT JOIN users u ON u.id = im.user_id
    WHERE im.itinerary_id = $1
  `;

    const result: IRawMember[] = await this.membersRepository.query(query, [
      itinerary_id,
    ]);
    return result.map((row) => this.transformMember(row));
  }

  private transformMember(member: IRawMember) {
    return {
      id: member.id,
      user_id: member.user_id,
      role: Number(member.role),
      user: {
        username: member.user_username,
        email: member.user_email,
        avatar: member.user_avatar,
      },
    };
  }
}

// @Injectable()
// export class ItineraryMembersService {
//   constructor(
//     @InjectRepository(ItineraryMember)
//     private readonly membersRepository: Repository<ItineraryMember>,
//   ) {}

//   async create({ user_id, itinerary_id }: CreateItineraryMemberDto) {
//     const memberExists = await this.membersRepository.findOne({
//       where: {
//         user_id,
//         itinerary_id,
//       },
//     });

//     if (memberExists) {
//       throw new BadRequestException('Member already exists');
//     }

//     const member = await this.membersRepository.save({ user_id, itinerary_id });

//     const fullMember = await this.membersRepository.findOne({
//       where: { id: member.id },
//       relations: ['user'],
//     });

//     return fullMember;
//   }

//   async remove(id: number) {
//     await this.membersRepository.delete(id);
//     return { success: true };
//   }

//   async findByItineraryId(itinerary_id: number) {
//     return this.membersRepository.find({
//       where: { itinerary_id },
//       relations: ['user'],
//     });
//   }
// }
