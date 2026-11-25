import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class CreateWorkExperienceDTO {
  @IsString()
  @IsNotEmpty()
  company_name!: string;

  @IsString()
  @IsNotEmpty()
  job_title!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_date!: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
