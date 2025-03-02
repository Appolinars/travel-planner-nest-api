import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  itinerary_id: number;

  @IsNotEmpty()
  @IsString()
  expense_id: string;
}
