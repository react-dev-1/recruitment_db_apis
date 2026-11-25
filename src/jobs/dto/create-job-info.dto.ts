import { Type } from "class-transformer";
import { IsArray, IsDefined, IsOptional, ValidateNested } from "class-validator";
import { CreateJobDTO } from "./create-job.dto";
import { CreateJobPostingDTO } from "./create-job-posting.dto";

export class CreateJobInfoDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateJobDTO)
  job!: CreateJobDTO;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateJobPostingDTO)
  job_postings?: CreateJobPostingDTO[];
}