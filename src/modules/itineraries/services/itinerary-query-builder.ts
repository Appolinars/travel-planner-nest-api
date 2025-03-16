import { IPaginatedResponse } from 'src/shared/types/filters.types';
import { DataSource } from 'typeorm';

import {
  EItinerarySortField,
  SearchItinerariesDto,
} from '../dto/search-itineraries.dto';
import {
  EItineraryMemberRole,
  IItineraryResponse,
  IRawFullItineraryResult,
} from '../types/itineraries.types';

export interface QueryOptions {
  baseQuery: string;
  initialParams: (string | number)[];
}

export class ItineraryQueryBuilder {
  constructor(
    private dataSource: DataSource,
    private options: QueryOptions,
    private searchDto: SearchItinerariesDto,
  ) {}

  async execute(): Promise<IPaginatedResponse<IItineraryResponse[]>> {
    const {
      query,
      destination,
      sortField,
      sortOrder,
      page = 1,
      size = 10,
    } = this.searchDto;
    const currentPage = page < 1 ? 1 : page;
    const itemsPerPage = size < 1 ? 10 : size;
    const offset = (currentPage - 1) * itemsPerPage;

    let baseQuery = this.options.baseQuery;
    const params = [...this.options.initialParams];
    const whereClauses: string[] = [];

    // Apply filters
    if (query) {
      whereClauses.push(`i.title ILIKE $${params.length + 1}`);
      params.push(`%${query}%`);
    }

    if (destination) {
      whereClauses.push(`$${params.length + 1} = ANY(i.destinations)`);
      params.push(destination);
    }

    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Count total items
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as subquery`;
    const [{ total }] = await this.dataSource.query<{ total: string }[]>(
      countQuery,
      params,
    );
    const totalItems = parseInt(total, 10);

    // Apply sorting and pagination
    const orderByQuery = this.constructSortingQuery(sortField, sortOrder);
    let sqlQuery = baseQuery;
    sqlQuery += ` ${orderByQuery}`;
    sqlQuery += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(itemsPerPage, offset);

    const results = await this.dataSource.query<IRawFullItineraryResult[]>(
      sqlQuery,
      params,
    );

    return {
      data: results.map(this.mapToResponse),
      total: totalItems,
      page: currentPage,
      size: itemsPerPage,
    };
  }

  private constructSortingQuery(
    sortField?: EItinerarySortField,
    sortOrder?: string,
  ): string {
    const defaultSort = 'i.created_at';
    const defaultOrder = 'DESC';

    let orderByClause = `ORDER BY ${defaultSort} ${defaultOrder}`;
    if (sortField && sortOrder) {
      const validFields = {
        [EItinerarySortField.CREATED_AT]: 'i.created_at',
        [EItinerarySortField.START_DATE]: 'i.start_date',
        [EItinerarySortField.END_DATE]: 'i.end_date',
        [EItinerarySortField.TITLE]: 'i.title',
      };
      const dbField = validFields[sortField];
      if (dbField) {
        orderByClause = `ORDER BY ${dbField} ${sortOrder}`;
      }
    }
    return orderByClause;
  }

  private mapToResponse(raw: IRawFullItineraryResult): IItineraryResponse {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      start_date: raw.start_date,
      end_date: raw.end_date,
      destinations: raw.destinations,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      owner: {
        id: raw.member_id,
        user_id: raw.user_id,
        role: Number(raw.role) as EItineraryMemberRole,
        user: {
          username: raw.username,
          email: raw.email,
          avatar: raw.avatar,
        },
      },
    };
  }
}
