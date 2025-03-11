import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class PaginationDto {
  constructor(params?: Partial<PaginationDto>) {
    Object.assign(this, params);
  }

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page = 1;

  get offset() {
    return (this.page - 1) * this.size;
  }

  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @IsOptional()
  size = 20;
}
