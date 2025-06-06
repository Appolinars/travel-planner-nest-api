import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { User } from 'src/modules/users/entities/user.entity';
import { IPaginatedResponse } from 'src/shared/types/filters.types';
import { DataSource } from 'typeorm';

import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import {
  EItinerarySortField,
  SearchItinerariesDto,
} from '../dto/search-itineraries.dto';
import { UpdateItineraryDto } from '../dto/update-itinerary.dto';
import {
  EItineraryMemberRole,
  IItineraryResponse,
  IRawFullItineraryResult,
  IRawItineraryResult,
  IRawOwner,
} from '../types/itineraries.types';
import { ItineraryQueryBuilder } from './itinerary-query-builder';

@Injectable()
export class ItinerariesService {
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    createItineraryDto: CreateItineraryDto,
    user: User,
  ): Promise<IItineraryResponse> {
    // caching example
    // await this.cacheManager.set(
    //   'test-key',
    //   { prop: 123, obj: { a: false, b: 2, c: '123' } },
    //   60000,
    // );
    // const value = await this.cacheManager.get('test-key');
    // console.log({ value });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const itineraryResult: IRawItineraryResult[] = await queryRunner.query(
        `INSERT INTO itineraries (title, description, start_date, end_date, destinations)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          createItineraryDto.title,
          createItineraryDto.description,
          createItineraryDto.start_date,
          createItineraryDto.end_date,
          createItineraryDto.destinations,
        ],
      );
      const itinerary = itineraryResult[0];

      const memberResult: { id: number }[] = await queryRunner.query(
        `INSERT INTO itinerary_members (itinerary_id, user_id, role)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [itinerary.id, user.id, EItineraryMemberRole.OWNER],
      );
      const memberId = memberResult[0].id;

      const ownerResult: IRawOwner[] = await queryRunner.query(
        `
          SELECT 
            im.id as member_id,
            im.role, 
            u.id as user_id, 
            u.username, 
            u.email, 
            u.avatar
          FROM itinerary_members im
          LEFT JOIN users u ON u.id = im.user_id
          WHERE im.id = $1
        `,
        [memberId],
      );
      const owner = ownerResult[0];

      await queryRunner.commitTransaction();
      return {
        ...itinerary,
        owner: {
          id: owner.member_id,
          role: Number(owner.role) as EItineraryMemberRole,
          user_id: owner.user_id,
          user: {
            avatar: owner.avatar,
            username: owner.username,
            email: owner.email,
          },
        },
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating itinerary');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    searchDto: SearchItinerariesDto,
  ): Promise<IPaginatedResponse<IItineraryResponse[]>> {
    // const respo = await this.mailerService.sendMail({
    //   from: 'Acme <vakulenko.maksim977@gmail.com>',
    //   to: 'vakulenko.maksim977@gmail.com',
    //   subject: 'hello world 333',
    //   text: 'it works! 444',
    // });

    const baseQuery = `
      SELECT 
        i.*,
        im.id as member_id,
        im.role,
        u.id as user_id,
        u.username,
        u.email,
        u.avatar
      FROM itineraries i
      INNER JOIN itinerary_members im ON im.itinerary_id = i.id
      LEFT JOIN users u ON u.id = im.user_id AND im.role = $1
    `;

    const queryBuilder = new ItineraryQueryBuilder(
      this.dataSource,
      {
        baseQuery,
        initialParams: [EItineraryMemberRole.OWNER],
      },
      searchDto,
    );

    return queryBuilder.execute();
  }

  async findOne(id: number): Promise<IItineraryResponse> {
    const results = await this.dataSource.query<IRawFullItineraryResult[]>(
      `
      SELECT 
        i.*,
        im.id as member_id,
        im.role,
        u.id as user_id,
        u.username,
        u.email,
        u.avatar
      FROM itineraries i
      LEFT JOIN itinerary_members im ON im.itinerary_id = i.id AND im.role = $2
      LEFT JOIN users u ON u.id = im.user_id
      WHERE i.id = $1
    `,
      [id, EItineraryMemberRole.OWNER],
    );

    if (!results.length) {
      throw new NotFoundException('Itinerary not found');
    }

    return this.mapToResponse(results[0]);
  }

  async update(
    id: number,
    updateItineraryDto: UpdateItineraryDto,
  ): Promise<IItineraryResponse> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (updateItineraryDto.title) {
      updates.push(`title = $${paramCount++}`);
      values.push(updateItineraryDto.title);
    }
    if (updateItineraryDto.description) {
      updates.push(`description = $${paramCount++}`);
      values.push(updateItineraryDto.description);
    }
    if (updateItineraryDto.start_date) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(updateItineraryDto.start_date);
    }
    if (updateItineraryDto.end_date) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(updateItineraryDto.end_date);
    }
    if (updateItineraryDto.destinations) {
      updates.push(`destinations = $${paramCount++}`);
      values.push(JSON.stringify(updateItineraryDto.destinations));
    }

    values.push(id);
    await this.dataSource.query<IRawItineraryResult[]>(
      `UPDATE itineraries 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.dataSource.query(`DELETE FROM itineraries WHERE id = $1`, [id]);
    return { success: true };
  }

  private mapToResponse(result: IRawFullItineraryResult): IItineraryResponse {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      start_date: result.start_date,
      end_date: result.end_date,
      destinations: result.destinations,
      created_at: result.created_at,
      updated_at: result.updated_at,
      owner: {
        id: result.member_id,
        user_id: result.user_id,
        role: Number(result.role) as EItineraryMemberRole,
        user: {
          username: result.username,
          email: result.email,
          avatar: result.avatar,
        },
      },
    };
  }

  private constructSortingQuery(sortField: string, sortOrder: string) {
    const defaultSort = 'i.created_at';
    const defaultOrder = 'DESC';

    let orderByQuery = `ORDER BY ${defaultSort} ${defaultOrder}`;
    if (sortField && sortOrder) {
      const validFields = {
        [EItinerarySortField.CREATED_AT]: 'i.created_at',
        [EItinerarySortField.START_DATE]: 'i.start_date',
        [EItinerarySortField.END_DATE]: 'i.end_date',
        [EItinerarySortField.TITLE]: 'i.title',
      };
      const dbField = validFields[sortField];
      if (dbField) {
        orderByQuery = `ORDER BY ${dbField} ${sortOrder}`;
      }
    }

    return orderByQuery;
  }
}

// @Injectable()
// export class ItinerariesService {
//   constructor(
//     @InjectRepository(Itinerary)
//     private readonly itineraryRepository: Repository<Itinerary>,
//     private dataSource: DataSource,
//   ) {}

//   async create(createItineraryDto: CreateItineraryDto, user: User) {
//     const queryRunner = this.dataSource.createQueryRunner();

//     await queryRunner.connect();
//     await queryRunner.startTransaction();
//     try {
//       const itinerary = await queryRunner.manager.save(
//         Itinerary,
//         createItineraryDto,
//       );

//       const itineraryOwner = await queryRunner.manager.save(ItineraryMember, {
//         itinerary_id: itinerary.id,
//         user_id: user.id,
//         role: EItineraryMemberRole.OWNER,
//       });

//       const itineraryOwnerWithUser = await queryRunner.manager.findOne(
//         ItineraryMember,
//         {
//           where: { id: itineraryOwner.id },
//           relations: ['user'],
//         },
//       );

//       await queryRunner.commitTransaction();
//       return { ...itinerary, owner: itineraryOwnerWithUser };
//     } catch (error) {
//       console.log(error);
//       await queryRunner.rollbackTransaction();
//       new BadRequestException('Error creating itinerary');
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async findAll(): Promise<IItineraryResponse[]> {
//     const itineraries = await this.itineraryRepository
//       .createQueryBuilder('itinerary')
//       .leftJoinAndSelect('itinerary.members', 'member', 'member.role = :role', {
//         role: EItineraryMemberRole.OWNER,
//       })
//       .leftJoinAndSelect('member.user', 'user')
//       .getMany();

//     const mappedItineraries = itineraries.map((itinerary) => {
//       const owner = itinerary.members[0];
//       delete itinerary.members;
//       return {
//         ...itinerary,
//         owner,
//       };
//     });

//     return mappedItineraries;
//   }

//   async findOne(id: number): Promise<IItineraryResponse> {
//     const itinerary = await this.itineraryRepository
//       .createQueryBuilder('itinerary')
//       .leftJoinAndSelect('itinerary.members', 'member', 'member.role = :role', {
//         role: EItineraryMemberRole.OWNER,
//       })
//       .leftJoinAndSelect('member.user', 'user')
//       .where('itinerary.id = :id', { id })
//       .getOne();

//     if (!itinerary) {
//       throw new NotFoundException('Itinerary not found');
//     }

//     const owner = itinerary.members[0];
//     delete itinerary.members;
//     return {
//       ...itinerary,
//       owner,
//     };
//   }

//   async update(
//     id: number,
//     updateItineraryDto: UpdateItineraryDto,
//   ): Promise<IItineraryResponse> {
//     const itinerary = await this.findOne(id);

//     Object.assign(itinerary, updateItineraryDto);

//     const updatedItinerary = await this.itineraryRepository.save(itinerary);
//     return updatedItinerary;
//   }

//   async remove(id: number) {
//     await this.itineraryRepository.delete(id);
//     return { success: true };
//   }
// }
