import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import type { JobSkillImportance } from '../skill.type';

export class CreateSkillDTO {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsString()
  @IsOptional()
  category?: string | null;
}

export class CreateCandidateSkillsDTO {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  years_of_experience!: number;
}

export class CreateJobSkillsDTO {
  @IsString()
  @IsNotEmpty()
  importance!: JobSkillImportance;
}
