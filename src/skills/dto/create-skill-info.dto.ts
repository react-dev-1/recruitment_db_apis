import { Type } from "class-transformer";
import { IsArray, IsDefined, IsOptional, ValidateNested } from "class-validator";
import { CreateCandidateSkillsDTO, CreateJobSkillsDTO, CreateSkillDTO } from "./create-skill.dto";

export class CreateSkillInfoDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSkillDTO)
  skill!: CreateSkillDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateJobSkillsDTO)
  job_skills?: CreateJobSkillsDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateSkillsDTO)
  candidate_skill?: CreateCandidateSkillsDTO[];
}