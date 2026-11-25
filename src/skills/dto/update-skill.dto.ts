import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateSkillsDTO, CreateJobSkillsDTO, CreateSkillDTO } from './create-skill.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateSkillDTO extends PartialType(CreateSkillDTO) {}

export class UpdateCandidateSkillsDTO extends PartialType(CreateCandidateSkillsDTO) {
    @IsInt()
    @IsNotEmpty()
    id!: number;
}

export class UpdateJobSkillsDTO extends PartialType(CreateJobSkillsDTO) {
    @IsInt()
    @IsNotEmpty()
    id!: number;
}
