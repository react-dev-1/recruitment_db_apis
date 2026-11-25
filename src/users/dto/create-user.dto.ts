import { IsOptional, IsEmail, IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import type { UserRole } from '../user.type';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEnum(['admin', 'recruiter', 'interviewer', 'hiring_manager'])
  role!: UserRole; 
}