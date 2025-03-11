import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ESortOrder } from 'src/shared/types/filters.types';

export enum EItinerarySortField {
  CREATED_AT = 'created_at',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  TITLE = 'title',
}

export class SearchItinerariesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(EItinerarySortField)
  sortField?: EItinerarySortField;

  @IsOptional()
  @IsEnum(ESortOrder)
  sortOrder?: ESortOrder;

  @IsOptional()
  @IsString()
  destination?: string;
}
