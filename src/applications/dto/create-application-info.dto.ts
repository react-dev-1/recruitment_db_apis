import { IsDefined, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateApplicationDTO } from "./create-application.dto";
import { CreateCandidateDTO } from "../../candidates/dto/create/create-candidate.dto";
import { CreateJobDTO } from "../../jobs/dto/create-job.dto";

export class CreateApplicationInfoDTO {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateApplicationDTO)
  application!: CreateApplicationDTO;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateDTO)
  candidate!: CreateCandidateDTO;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateJobDTO)
  job!: CreateJobDTO;
}