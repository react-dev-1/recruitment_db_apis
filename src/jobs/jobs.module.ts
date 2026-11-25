import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "./entities/job.entity";
import { JobPosting } from "./entities/job-posting.entity";
import { JobsService } from "./jobs.service";
import { JobsController } from "./jobs.controller";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Job, JobPosting]), UsersModule],
    controllers: [JobsController],
    providers: [JobsService],
    exports: [JobsService],
})

export class JobsModule { }