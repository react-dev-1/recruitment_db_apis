import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdateCandidateDTO } from "../../candidates/dto/update/update-candidate.dto";
import { UpdateApplicationDTO } from "./update-application.dto";
import { UpdateJobDTO } from "../../jobs/dto/update-job.dto";

export class UpdateApplicationInfoDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateApplicationDTO)
  application?: UpdateApplicationDTO;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCandidateDTO)
  candidate?: UpdateCandidateDTO;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobDTO)
  job?: UpdateJobDTO;
}