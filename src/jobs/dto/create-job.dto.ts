import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import type { JobStatus } from '../job.type';

export class CreateJobDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  employment_type?: string;

  @IsString()
  @IsOptional()
  experience_level?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  salary_min?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  salary_max?: number;

  @IsEnum(['open', 'closed', 'paused'])
  @IsOptional()
  status?: JobStatus;
}
