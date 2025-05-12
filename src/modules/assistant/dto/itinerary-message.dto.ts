import { IsString } from 'class-validator';

export class ItineraryMessageDto {
  @IsString()
  message: string;
}
