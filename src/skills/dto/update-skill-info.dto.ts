import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { UpdateCandidateSkillsDTO, UpdateJobSkillsDTO, UpdateSkillDTO } from "./update-skill.dto";

export class UpdateSkillInfoDTO {
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateSkillDTO)
    skill?: UpdateSkillDTO;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateJobSkillsDTO)
    job_skills?: UpdateJobSkillsDTO[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateCandidateSkillsDTO)
    candidate_skills?: UpdateCandidateSkillsDTO[];
}