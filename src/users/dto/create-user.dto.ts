import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Username must have at least 2 characters.' })
  @MaxLength(100, { message: 'Max length is 100' })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @MaxLength(254, { message: 'Max length is 254' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Min length is 2' })
  @MaxLength(200, { message: 'Max length is 200' })
  password: string;
}
