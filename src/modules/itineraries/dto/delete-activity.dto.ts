import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteActivityDto {
  @IsNotEmpty()
  @IsNumber()
  itinerary_id: number;

  @IsNotEmpty()
  @IsString()
  activity_id: string;
}
