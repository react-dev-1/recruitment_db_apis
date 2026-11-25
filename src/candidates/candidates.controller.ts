import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CandidatesService } from "./candidates.service";
import { CreateCandidateDTO } from "./dto/create/create-candidate.dto";
import { CreateEducationDTO } from "./dto/create/create-education.dto";
import { CreateWorkExperienceDTO } from "./dto/create/create-work-experience.dto";
import { CreateResumeDTO } from "./dto/create/create-resume.dto";
import { UpdateCandidateDTO } from "./dto/update/update-candidate.dto";
import { UpdateEducationDTO } from "./dto/update/update-education.dto";
import { UpdateWorkExperienceDTO } from "./dto/update/update-work-experience.dto";
import { UpdateResumeDTO } from "./dto/update/update-resume.dto";
import { CreateCandidateInfoDto } from "./dto/create/create-candidate-info.dto";
import { UpdateCandidateInfoDto } from "./dto/update/update-candidate-info.dto";


// @Controller('candidates') = class-level decorator. It registers this class
// with Nest's router and prefixes ALL routes in it with `/candidates`. (base route)
// So @Get() below becomes GET /candidates, @Get(':id') becomes GET /candidates/:id, etc.
@Controller('candidates')
export class CandidatesController {
    // Dependency Injection
    // `private readonly` stores it as a class field we can call: this.candidatesService.xxx()
    constructor(private readonly candidatesService: CandidatesService) { }

    @Get()
    getAllCandidates() {
        return this.candidatesService.getAllCandidates()
    }

    @Get('all')
    getAllCandidatesInfo() {
        return this.candidatesService.getAllCandidatesInfo()
    }

    @Get(':candidateId/educations')
    getAllEducations(
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getAllEducations(candidateId)
    }

    @Get(':candidateId/work-experiences')
    getAllWorkExperiences(
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getAllWorkExperiences(candidateId)
    }

    @Get(':candidateId/resumes')
    getAllResumes(
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getAllResumes(candidateId)
    }

    @Get(':id')
    getCandidateById(@Param('id', ParseIntPipe) id: number) {
        return this.candidatesService.getCandidateById(id)
    }

    @Get(':id/info')
    getCandidateInfoById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.candidatesService.getCandidateInfoById(id)
    }

    @Get(':candidateId/educations/:id')
    getEducationById(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getEducationById(id, candidateId)
    }

    @Get(':candidateId/work-experiences/:id')
    getWorkExperienceById(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getWorkExperienceById(id, candidateId)
    }

    @Get(':candidateId/resumes/:id')
    getResumeById(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.getResumeById(id, candidateId)
    }

    @Delete(':id')
    deleteCandidate(@Param('id', ParseIntPipe) id: number) {
        return this.candidatesService.deleteCandidate(id)
    }

    @Delete(':candidateId/educations/:id')
    deleteEducation(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.deleteEducation(id, candidateId)
    }

    @Delete(':candidateId/work-experiences/:id')
    deleteWorkExperience(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.deleteWorkExperience(id, candidateId)
    }

    @Delete(':candidateId/resumes/:id')
    deleteResume(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.candidatesService.deleteResume(id, candidateId)
    }

    @Post()
    createCandidate(@Body() dto: CreateCandidateDTO) {
        return this.candidatesService.createCandidate(dto);
    }

    @Post('info') 
    createCandidateInfo(@Body() dto: CreateCandidateInfoDto) {
        return this.candidatesService.createCandidateInfo(dto);
    }

    @Post(':candidateId/educations')
    createEducation(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto: CreateEducationDTO
    ) {
        return this.candidatesService.createEducation(candidateId, dto)
    }

    @Post(':candidateId/work-experiences')
    createWorkExperience(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto: CreateWorkExperienceDTO
    ) {
        return this.candidatesService.createWorkExperience(candidateId, dto)
    }

    @Post(':candidateId/resumes')
    createResume(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto: CreateResumeDTO
    ) {
        return this.candidatesService.createResume(candidateId, dto)
    }

    @Patch(':id')
    updateCandidate(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto:UpdateCandidateDTO
    ) {
        return this.candidatesService.updateCandidate(id, dto);
    }

    @Patch(':id/info')
    updateCandidateInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCandidateInfoDto
    ) {
        return this.candidatesService.updateCandidateInfo(id, dto);
    }

    @Patch(':candidateId/educations/:id')
    updateEducation(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto:UpdateEducationDTO
    ) {
        return this.candidatesService.updateEducation(id, candidateId, dto);
    }

    @Patch(':candidateId/work-experiences/:id')
    updateWorkExperience(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto:UpdateWorkExperienceDTO
    ) {
        return this.candidatesService.updateWorkExperience(id, candidateId, dto);
    }

    @Patch(':candidateId/resumes/:id')
    updateResume(
        @Param('id', ParseIntPipe) id: number,
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto:UpdateResumeDTO
    ) {
        return this.candidatesService.updateResume(id, candidateId, dto);
    }
}