import { IsOptional, IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateCandidateDTO {
  // Required non-empty string. The `!` (definite assignment assertion) tells
  // TypeScript "trust me, this will be assigned" — needed because strict mode
  // would otherwise complain that the field isn't initialized in the constructor.
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  // Must be a syntactically valid email 
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  linkedin_url?: string;

  @IsString()
  @IsOptional()
  portfolio_url?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}
