import { IsOptional, IsString } from 'class-validator';

export class CreateResumeDTO {
  @IsString()
  @IsOptional()
  file_name?: string;

  @IsString()
  @IsOptional()
  file_path?: string;

  @IsString()
  @IsOptional()
  parsed_text?: string;
}
