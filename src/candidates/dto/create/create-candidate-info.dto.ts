import { Type } from "class-transformer";
import { IsArray, IsDefined, IsOptional, ValidateNested } from "class-validator";
import { CreateCandidateDTO } from "./create-candidate.dto";
import { CreateEducationDTO } from "./create-education.dto";
import { CreateWorkExperienceDTO } from "./create-work-experience.dto";
import { CreateResumeDTO } from "./create-resume.dto";

export class CreateCandidateInfoDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateCandidateDTO)
  candidate!: CreateCandidateDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDTO)
  educations?: CreateEducationDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkExperienceDTO)
  work_experiences?: CreateWorkExperienceDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResumeDTO)
  resumes?: CreateResumeDTO[];
}