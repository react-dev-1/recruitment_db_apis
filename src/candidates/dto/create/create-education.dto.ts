import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateEducationDTO {
  @IsString()
  @IsNotEmpty()
  degree!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsString()
  @IsNotEmpty()
  field_of_study!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_date!: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  grade?: string;
}
