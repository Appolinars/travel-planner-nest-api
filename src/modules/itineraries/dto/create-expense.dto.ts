import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  itinerary_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  currency: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  notes?: string;
}
