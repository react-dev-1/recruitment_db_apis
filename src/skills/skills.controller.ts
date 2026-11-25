import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { SkillsService } from "./skills.service";
import { CreateCandidateSkillsDTO, CreateJobSkillsDTO, CreateSkillDTO } from "./dto/create-skill.dto";
import { UpdateCandidateSkillsDTO, UpdateJobSkillsDTO, UpdateSkillDTO } from "./dto/update-skill.dto";
import { CreateSkillInfoDto } from "./dto/create-skill-info.dto";
import { UpdateSkillInfoDTO } from "./dto/update-skill-info.dto";

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Get('all')
    getAllSkillsInfo() {
        return this.skillsService.getAllSkillsInfo()
    }

    @Get(':skillId/:jobId/:candidateId/info')
    getSkillInfoByIds(
        @Param('skillId', ParseIntPipe) skillId: number,
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('candidateId', ParseIntPipe) candidateId: number,
    ) {
        return this.skillsService.getSkillInfoByIds(jobId, candidateId, skillId)
    }
    
    @Get(':id')
    getSkillById(@Param('id', ParseIntPipe) id: number) {
        return this.skillsService.getSkillById(id)
    }

    @Get('job-skill/:jobId/:skillId')
    getJobSkillByIds(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('skillId', ParseIntPipe) skillId: number) {
        return this.skillsService.getJobSkillByIds(jobId, skillId)
    }

    @Get('candidate-skill/:candidateId/:skillId')
    getCandidateSkillByIds(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Param('skillId', ParseIntPipe) skillId: number) {
        return this.skillsService.getCandidateSkillByIds(candidateId, skillId)
    }

    @Get()
    getAllSkills() {
        return this.skillsService.getAllSkills()
    }

    @Get('job-skill/:jobId')
    getAllJobSkills(
        @Param('jobId', ParseIntPipe) jobId: number
    ) {
        return this.skillsService.getAllJobSkills(jobId)
    }

    @Get('candidate-skill/:candidateId')
    getAllCandidateSkills(
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.skillsService.getAllCandidateSkills(candidateId)
    }

    @Post()
    createSkill(
        @Body() dto: CreateSkillDTO
    ) {
        return this.skillsService.createSkill(dto)
    }

    @Post(':jobId/:candidateId/info')
    createSkillInfo(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Body() dto: CreateSkillInfoDto
    ) {
        return this.skillsService.createSkillInfo(jobId, candidateId, dto)
    }

    @Post('job-skill/:jobId/:skillId')
    createJobSkill(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('skillId', ParseIntPipe) skillId: number,
        @Body() dto: CreateJobSkillsDTO
    ) {
        return this.skillsService.createJobSkill(jobId, skillId, dto)
    }

    @Post('candidate-skill/:candidateId/:skillId')
    createCandidateSkill(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Param('skillId', ParseIntPipe) skillId: number,
        @Body() dto: CreateCandidateSkillsDTO
    ) {
        return this.skillsService.createCandidateSkill(candidateId, skillId, dto)
    }

    @Patch(':id')
    updateSkill(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSkillDTO
    ) {
        return this.skillsService.updateSkill(id, dto)
    }

    @Patch(':id/info')
    updateSkillInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSkillInfoDTO
    ) {
        return this.skillsService.updateSkillInfo(id, dto)
    }

    @Patch('job-skill/:jobId/:skillId')
    updateJobSkill(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('skillId', ParseIntPipe) skillId: number,
        @Body() dto: UpdateJobSkillsDTO
    ) {
        return this.skillsService.updateJobSkill(jobId, skillId, dto)
    }

    @Patch('candidate-skill/:candidateId/:skillId')
    updateCandidateSkill(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Param('skillId', ParseIntPipe) skillId: number,
        @Body() dto: UpdateCandidateSkillsDTO
    ) {
        return this.skillsService.updateCandidateSkill(candidateId, skillId, dto)
    }

    @Delete(':id')
    deleteSkill(@Param('id', ParseIntPipe) id: number) {
        return this.skillsService.deleteSkill(id)
    }

    @Delete('job-skill/:jobId/:skillId')
    deleteJobSkill(
        @Param('jobId', ParseIntPipe) jobId: number,
        @Param('skillId', ParseIntPipe) skillId: number
    ) {
        return this.skillsService.deleteJobSkill(jobId, skillId)
    }

    @Delete('candidate-skill/:candidateId/:skillId')
    deleteCandidateSkill(
        @Param('candidateId', ParseIntPipe) candidateId: number,
        @Param('skillId', ParseIntPipe) skillId: number
    ) {
        return this.skillsService.deleteCandidateSkill(candidateId, skillId)
    }
}