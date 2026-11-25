import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobSkill } from "./entities/job-skill.entity";
import { CandidateSkill } from "./entities/candidate-skill.entity";
import { Skill } from "./entities/skill.entity";
import { SkillsService } from "./skills.service";
import { SkillsController } from "./skills.controller";
import { CandidatesModule } from "../candidates/candidates.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
    imports: [TypeOrmModule.forFeature([Skill, JobSkill, CandidateSkill]), CandidatesModule, JobsModule],
    controllers: [SkillsController],
    providers: [SkillsService],
})

export class SkillsModule {}