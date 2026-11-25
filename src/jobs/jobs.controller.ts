import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateJobDTO } from "./dto/create-job.dto";
import { UpdateJobPostingDTO } from "./dto/update-job-posting.dto";
import { UpdateJobDTO } from "./dto/update-job.dto";
import { CreateJobPostingDTO } from "./dto/create-job-posting.dto";
import { JobsService } from "./jobs.service";
import { CreateJobInfoDto } from "./dto/create-job-info.dto";
import { UpdateJobInfoDTO } from "./dto/update-job-info.dto";

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Get('all')
    getAllJobsInfo() {
        return this.jobsService.getAllJobsInfo()
    }

    @Get(':id')
    getJobById(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.getJobById(id)
    }

    @Get(':jobId/info')
    getJobInfo(
        @Param('jobId', ParseIntPipe) jobId: number
    ) {
        return this.jobsService.getJobInfoById(jobId)
    }

    @Get(':jobId/job-posting/:id')
    getJobPostingById(
        @Param('id', ParseIntPipe) id: number,
        @Param('jobId', ParseIntPipe) jobId: number) {
        return this.jobsService.getJobPostingById(id, jobId)
    }

    @Get()
    getAllJobs() {
        return this.jobsService.getAllJobs()
    }

    @Get(':jobId/job-posting')
    getAllJobPostings(
        @Param('jobId', ParseIntPipe) jobId: number
    ) {
        return this.jobsService.getAllJobPostings(jobId)
    }

    @Post(':userId')
    createJob(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateJobDTO
    ) {
        return this.jobsService.createJob(userId, dto)
    }

    @Post(':userId/info')
    createJobInfo(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateJobInfoDto
    ) {
        return this.jobsService.createJobInfo(userId, dto)
    }

    @Post(':jobId/job-posting')
    createJobPosting(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Body() dto: CreateJobPostingDTO
    ) {
        return this.jobsService.createJobPosting(jobId, dto)
    }

    @Patch(':id')
    updateJob(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateJobDTO
    ) {
        return this.jobsService.updateJob(id, dto)
    }

    @Patch('info/:id')
    updateJobInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateJobInfoDTO
    ) {
        return this.jobsService.updateJobInfo(id, dto)
    }

    @Patch(':jobId/job-posting/:id')
    updateJobPosting(
        @Param('id', ParseIntPipe) id: number,
        @Param('jobId', ParseIntPipe) jobId: number,
        @Body() dto: UpdateJobPostingDTO
    ) {
        return this.jobsService.updateJobPosting(id, jobId, dto)
    }

    @Delete(':id')
    deleteJob(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.deleteJob(id)
    }

    @Delete(':jobId/job-posting/:id')
    deleteJobPosting(@Param('id', ParseIntPipe) id: number,
        @Param('jobId', ParseIntPipe) jobId: number) {
        return this.jobsService.deleteJobPosting(id, jobId)
    }
}