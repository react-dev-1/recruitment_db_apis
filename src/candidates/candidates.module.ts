import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Candidate } from "./entities/candidate.entity";
import { Education } from "./entities/education.entity";
import { WorkExperience } from "./entities/work-experience.entity";
import { Resume } from "./entities/resume.entity";
import { CandidatesService } from "./candidates.service";
import { CandidatesController } from "./candidates.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Candidate, Education, WorkExperience, Resume])],
    controllers: [CandidatesController],
    providers: [CandidatesService],
    exports: [CandidatesService]
})

export class CandidatesModule {}