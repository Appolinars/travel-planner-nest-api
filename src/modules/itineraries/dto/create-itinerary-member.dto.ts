import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { EItineraryUserRole } from '../types/itineraries.types';

export class CreateItineraryMemberDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  itinerary_id: number;

  @IsOptional()
  @IsEnum(EItineraryUserRole)
  role?: EItineraryUserRole;
}
