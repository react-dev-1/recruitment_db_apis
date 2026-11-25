import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class CreateJobPostingDTO {
  @IsInt()
  @IsNotEmpty()
  job_id!: number;

  @IsString()
  @IsOptional()
  platform_name?: string;

  @IsString()
  @IsOptional()
  post_url?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  published_at?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expires_at?: Date;
}
