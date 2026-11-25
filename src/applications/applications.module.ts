import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "./entities/application.entity";
import { ApplicationsService } from "./applications.service";
import { ApplicationsController } from "./applications.controller";
import { CandidatesModule } from "../candidates/candidates.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
    imports: [TypeOrmModule.forFeature([Application]), CandidatesModule, JobsModule],
    controllers: [ApplicationsController],
    providers: [ApplicationsService]
})
export class ApplicationsModule {}