import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDTO } from "./dto/create-application.dto";
import { UpdateApplicationDTO } from "./dto/update-application.dto";
import { CreateApplicationInfoDTO } from "./dto/create-application-info.dto";
import { UpdateApplicationInfoDTO } from "./dto/update-application-info.dto";

@Controller('applications')
export class ApplicationsController {
    constructor (private readonly applicationsService: ApplicationsService) {}

    @Get('all')
    getAllApplicationInfos() {
        return this.applicationsService.getAllApplicationInfos();
    }

    @Get()
    getAllApplications() {
        return this.applicationsService.getAllApplications()
    }

    @Get(':id')
    getApplicationById(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.getApplicationById(id)
    }

    @Get(':id/candidate/:candidateId')
    getApplicationByCandidate(@Param('id', ParseIntPipe) id: number, @Param('candidateId', ParseIntPipe) candidateId: number) {
        return this.applicationsService.getApplicationByCandidate(id, candidateId);
    }
    
    @Get(':id/job/:jobId')
    getApplicationByJob(@Param('id', ParseIntPipe) id: number, @Param('jobId', ParseIntPipe) jobId: number) {
        return this.applicationsService.getApplicationByJob(id, jobId);
    }
    
    @Get('candidate/:candidateId')
    getAllApplicationsByCandidate(@Param('candidateId', ParseIntPipe) candidateId: number) {
        return this.applicationsService.getAllApplicationsByCandidate(candidateId);
    }
    
    @Get('job/:jobId')
    getAllApplicationsByJob(@Param('jobId', ParseIntPipe) jobId: number) {
        return this.applicationsService.getAllApplicationsByJob(jobId);
    }

    @Post(':userId/info')
    createApplicationInfo(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateApplicationInfoDTO
    ) {
        return this.applicationsService.createApplicationInfo(userId,dto)
    }    

    @Post(':candidateId/:jobId')
    createApplication(
        @Param('candidateId', ParseIntPipe) candidateId: number, 
        @Param('jobId', ParseIntPipe) jobId: number,
        @Body() dto: CreateApplicationDTO,
    ) {
        return this.applicationsService.createApplication(candidateId, jobId, dto)
    }

    @Patch(':id')
    updateApplication(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplicationDTO,
    ) {
        return this.applicationsService.updateApplication(id, dto)
    }

    @Patch('/info/:candidateId/:jobId')
    updateApplicationInfo(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Param('jobId', ParseIntPipe) jobId: number,
        @Body() dto: UpdateApplicationInfoDTO
    ) {
        return this.applicationsService.updateApplicationInfo(candidateId, jobId, dto)
    }  

    @Delete(':id')
    deleteApplication(@Param('id', ParseIntPipe) id: number) {
        return this.applicationsService.deleteApplication(id)
    }
}