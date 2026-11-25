import { Type } from "class-transformer";
import { IsArray, IsDefined, IsOptional, ValidateNested } from "class-validator";
import { UpdateCandidateDTO } from "./update-candidate.dto";
import { UpdateEducationDTO } from "./update-education.dto";
import { UpdateWorkExperienceDTO } from "./update-work-experience.dto";
import { UpdateResumeDTO } from "./update-resume.dto";

export class UpdateCandidateInfoDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCandidateDTO)
  candidate?: UpdateCandidateDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationDTO)
  educations?: UpdateEducationDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkExperienceDTO)
  work_experiences?: UpdateWorkExperienceDTO[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateResumeDTO)
  resumes?: UpdateResumeDTO[];
}