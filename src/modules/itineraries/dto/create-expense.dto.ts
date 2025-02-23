import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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
  @IsNumber(
    { maxDecimalPlaces: 6 },
    { message: 'Amount must have no more than 6 decimal places' },
  )
  @Max(999999999999.999999, {
    message: 'Amount must not exceed 999999999999.999999',
  })
  @Min(0, { message: 'Amount must be at least 0' })
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
