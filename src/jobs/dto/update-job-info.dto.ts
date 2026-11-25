import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { UpdateJobDTO } from "./update-job.dto";
import { UpdateJobPostingDTO } from "./update-job-posting.dto";

export class UpdateJobInfoDTO {
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateJobDTO)
    job?: UpdateJobDTO;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateJobPostingDTO)
    job_postings?: UpdateJobPostingDTO[];
}