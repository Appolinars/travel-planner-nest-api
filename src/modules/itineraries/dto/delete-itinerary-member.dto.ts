import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteItineraryMemberDto {
  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsNumber()
  itinerary_id: number;
}
