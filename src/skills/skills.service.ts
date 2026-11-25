import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Skill as SkillEntity } from "./entities/skill.entity";
import { JobSkill as JobSkillEntity } from "./entities/job-skill.entity";
import { CandidateSkill as CandidateSkillEntity } from "./entities/candidate-skill.entity";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCandidateSkillsDTO, CreateJobSkillsDTO, CreateSkillDTO } from "./dto/create-skill.dto";
import { CandidateResponse, CandidatesService } from "../candidates/candidates.service";
import { JobResponse, JobsService } from "../jobs/jobs.service";
import { UpdateCandidateSkillsDTO, UpdateJobSkillsDTO, UpdateSkillDTO } from "./dto/update-skill.dto";
import { CreateSkillInfoDto } from "./dto/create-skill-info.dto";
import { UpdateSkillInfoDTO } from "./dto/update-skill-info.dto";

type SkillResponse = {
    id: number,
    skill_name: string | null,
    category: string | null
}

type CandidateSkillResponse = Pick<
    CandidateSkillEntity,
    'candidate_id' | "years_of_experience"
> & Omit<SkillResponse, "id"> & Pick<CandidateResponse, "first_name" | "last_name" | "email">;

type JobSkillResponse = Pick<
    JobSkillEntity, 
    'job_id' | "importance"
> & Omit<SkillResponse, "id"> & Pick<JobResponse, "title" | "description" | "requirements" | "status">;

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(SkillEntity)
        private readonly skillsRepository: Repository<SkillEntity>,

        @InjectRepository(JobSkillEntity)
        private readonly jobSkillRepository: Repository<JobSkillEntity>,

        @InjectRepository(CandidateSkillEntity)
        private readonly candidateSkillRepository: Repository<CandidateSkillEntity>,

        private readonly jobsService: JobsService,
        private readonly candidatesService: CandidatesService,
        
    ) { }

    private toSkillResponse(skill: SkillEntity): SkillResponse {
        return {
            id: skill.id,
            skill_name: skill.name,
            category: skill.category
        }
    }

    private toJobSkillResponse(jobSkill: JobSkillEntity): JobSkillResponse {
        return {
            job_id: jobSkill.job_id,
            title: jobSkill.job.title,
            description: jobSkill.job.description,
            requirements: jobSkill.job.requirements,
            status: jobSkill.job.status,
            skill_name: jobSkill.skill.name,
            category: jobSkill.skill.category,
            importance: jobSkill.importance
        }
    }

    private toCandidateSkillResponse(candidateSkill: CandidateSkillEntity): CandidateSkillResponse {
        return {
            candidate_id: candidateSkill.candidate_id,
            first_name: candidateSkill.candidate.first_name,
            last_name: candidateSkill.candidate.last_name,
            email: candidateSkill.candidate.email,
            skill_name: candidateSkill.skill.name,
            category: candidateSkill.skill.category,
            years_of_experience: candidateSkill.years_of_experience
        }
    }

    private async getSkillEntityById(id: number): Promise<SkillEntity> {
        const skill = await this.skillsRepository.findOneBy({ id });

        if (!skill) {
            throw new NotFoundException(`Skill with ${id} not found`);
        }

        return skill;
    }

    private async getJobSkillEntityById(jobId: number, skillId: number): Promise<JobSkillEntity> {
        const jobSkill = await this.jobSkillRepository.findOne({
            where: { job_id: jobId, skill_id: skillId },
            relations: { skill: true, job: true }
        });

        if (!jobSkill) {
            throw new NotFoundException(`Job Skill was not found for skill id ${skillId} and job id ${jobId}`);
        }

        return jobSkill;
    }

    private async getCandidateSkillEntityById(candidateId: number, skillId: number): Promise<CandidateSkillEntity> {
        const candidateSkill = await this.candidateSkillRepository.findOne({ 
            where: {candidate_id: candidateId, skill_id: skillId },
            relations: { skill: true, candidate: true }
        });

        if (!candidateSkill) {
            throw new NotFoundException(`Candidate Skill was not found`);
        }

        return candidateSkill;
    }

    async getSkillById(id: number): Promise<SkillResponse> {
        return this.toSkillResponse(await this.getSkillEntityById(id));
    }

    async getSkillInfoByIds(jobId: number, candidateId: number, skillId: number): Promise<{
        skill: SkillResponse;
        job_skills: JobSkillResponse[];
        candidate_skills: CandidateSkillResponse[];
    }> {
        const skill = await this.skillsRepository.findOne({
            where: { id: skillId },
            relations: { jobSkill: { skill: true, job: true }, candidateSkill: { skill: true, candidate: true } }
        })

        if (!skill) {
            throw new NotFoundException(`Job with ${skillId} not found`);
        }

        return {
            skill: this.toSkillResponse(skill),
            job_skills: skill.jobSkill.map((j) => this.toJobSkillResponse(j)),
            candidate_skills: skill.candidateSkill.map((c) => this.toCandidateSkillResponse(c))
        }

    }

    async getJobSkillByIds(jobId: number, skillId: number): Promise<JobSkillResponse> {
        return this.toJobSkillResponse(await this.getJobSkillEntityById(jobId, skillId));
    }

    async getCandidateSkillByIds(candidateId: number, skillId: number): Promise<CandidateSkillResponse> {
        return this.toCandidateSkillResponse(await this.getCandidateSkillEntityById(candidateId,skillId));
    }

    async getAllSkills(): Promise<SkillResponse[]> {
        const skills = await this.skillsRepository.find();
        return skills.map((skill) => this.toSkillResponse(skill));
    }

    async getAllSkillsInfo() {
        const skills = await this.skillsRepository.find({
            relations: { jobSkill: { job: true, skill: true }, candidateSkill: { candidate: true, skill: true } }
        })

        return skills.map((s) => ({
            ...this.toSkillResponse(s),
            jobSkill: s.jobSkill.map((j) => this.toJobSkillResponse(j)),
            candidateSkill: s.candidateSkill.map((c) => this.toCandidateSkillResponse(c))
        }))
    }

    async getAllJobSkills(jobId: number): Promise<JobSkillResponse[]> {
        const jobSkills = await this.jobSkillRepository.find({ 
            where: { job_id: jobId },
            relations: { skill: true, job: true }
        });

        return jobSkills.map((jobSkill) => this.toJobSkillResponse(jobSkill));
    }

    async getAllCandidateSkills(candidateId: number): Promise<CandidateSkillResponse[]> {
        const candidateSkills = await this.candidateSkillRepository.find({ 
            where: { candidate_id: candidateId },
            relations: { skill: true, candidate: true } 
        });
        return candidateSkills.map((candidateSkill) => this.toCandidateSkillResponse(candidateSkill));
    }

    async createSkill(dto: CreateSkillDTO): Promise<SkillResponse> {

        const existingSkill = await this.skillsRepository.findOneBy({
            name: dto.name ? dto.name : IsNull(), 
            category: dto.category ? dto.category : IsNull()
        });

        if (existingSkill) {
            throw new ConflictException(`Skill already exists`);
        }

        const skill = this.skillsRepository.create({
            name: dto.name ?? null,
            category: dto.category ?? null,
        })

        return this.toSkillResponse(await this.skillsRepository.save(skill))
    }

    async createSkillInfo(jobId: number, candidateId: number, dto: CreateSkillInfoDto): Promise<{
        skill: SkillResponse;
        job_skills: JobSkillResponse[];
        candidate_skills: CandidateSkillResponse[];
    }> {
        await this.jobsService.getJobById(jobId);
        await this.candidatesService.getCandidateById(candidateId);
        const skill = await this.createSkill(dto.skill);

        const job_skills: JobSkillResponse[] = [];
        for (const jobSkillDTO of dto.job_skills ?? []) {
            job_skills.push(await this.createJobSkill(jobId, skill.id, jobSkillDTO))
        };

        const candidate_skills: CandidateSkillResponse[] = [];
        for (const candidateSkillDTO of dto.candidate_skill ?? []) {
            candidate_skills.push(await this.createCandidateSkill(candidateId, skill.id, candidateSkillDTO))
        }

        return { skill, job_skills, candidate_skills }
    }

    async createJobSkill(jobId: number, skillId: number, dto: CreateJobSkillsDTO): Promise<JobSkillResponse> {
        await this.jobsService.getJobById(jobId);
        await this.getSkillEntityById(skillId);

        const existing = await this.jobSkillRepository.findOneBy({
            job_id: jobId, 
            skill_id: skillId
        });

        if (existing) {
            throw new ConflictException(`Skill ${skillId} is already associated with job ${jobId}`);
        }
        
        await this.jobSkillRepository.insert({
            job_id: jobId,
            skill_id: skillId,
            importance: dto.importance
        });

        // 3. Retrieve it with relations
        const savedRecord = await this.jobSkillRepository.findOne({
            where: { job_id: jobId, skill_id: skillId },
            relations: { job: true, skill: true }
        });

        if (!savedRecord) {
            throw new Error("Failed to retrieve the created job skill");
        }

        return this.toJobSkillResponse(savedRecord);
    }

    async createCandidateSkill(candidateId: number, skillId: number, dto: CreateCandidateSkillsDTO): Promise<CandidateSkillResponse> {
        await this.candidatesService.getCandidateById(candidateId);
        await this.getSkillEntityById(skillId);

        const existing = await this.candidateSkillRepository.findOneBy(
            {candidate_id: candidateId, skill_id: skillId}
        );

        if(existing) {
            throw new ConflictException(`Candidate id ${candidateId} is already associated with skill id ${skillId}`);
        }
        
        await this.candidateSkillRepository.insert({
            candidate_id: candidateId,
            skill_id: skillId,
            years_of_experience: dto.years_of_experience
        })

        const savedRecord = await this.candidateSkillRepository.findOne({
            where: {candidate_id: candidateId, skill_id: skillId},
            relations: {candidate: true, skill: true}
        })

        if (!savedRecord) {
            throw new Error("Failed to retrieve the created candidate skill");
        }

        return this.toCandidateSkillResponse(savedRecord);    }

    async updateSkill(id: number, dto: UpdateSkillDTO): Promise<SkillResponse> {
        const skill = await this.getSkillEntityById(id);
        
        Object.assign(skill, {
            ...(dto.name !==undefined && {name: dto.name}),
            ...(dto.category !==undefined && {category: dto.category}),
        })

        return this.toSkillResponse(await this.skillsRepository.save(skill))
    }

    async updateSkillInfo(id: number, dto: UpdateSkillInfoDTO): Promise<{
        skill: SkillResponse,
        job_skills: JobSkillResponse[],
        candidate_skills: CandidateSkillResponse[],
    }> {
        let skill: SkillResponse;

        if(dto.skill) {
            skill = await this.updateSkill(id, dto.skill)
        } else {
            skill = await this.getSkillById(id);
        }

        const job_skills: JobSkillResponse[] = [];
        for( const jobSkillDTO of dto.job_skills ?? []) {
            if(jobSkillDTO.id) {
                job_skills.push(await this.updateJobSkill(jobSkillDTO.id, skill.id, jobSkillDTO))
            }
        } 

        const candidate_skills: CandidateSkillResponse[] = [];
        for( const candidateSkillDTO of dto.candidate_skills ?? []) {
            if(candidateSkillDTO.id) {
                candidate_skills.push(await this.updateCandidateSkill(candidateSkillDTO.id, skill.id, candidateSkillDTO))
            }
        }

        return { skill, job_skills, candidate_skills }
    }

    async updateJobSkill(jobId: number, skillId: number, dto: UpdateJobSkillsDTO): Promise<JobSkillResponse> {
        const jobSkill = await this.getJobSkillEntityById(jobId, skillId);
        
        Object.assign(jobSkill, {
            ...(dto.importance !==undefined && {importance: dto.importance})
        })

        return this.toJobSkillResponse(await this.jobSkillRepository.save(jobSkill))
    }

    async updateCandidateSkill(candidateId: number, skillId: number, dto: UpdateCandidateSkillsDTO): Promise<CandidateSkillResponse> {
        const candidateSkill = await this.getCandidateSkillEntityById(candidateId, skillId);
        
        Object.assign(candidateSkill, {
            ...(dto.years_of_experience !==undefined && {years_of_experience: dto.years_of_experience})
        })

        return this.toCandidateSkillResponse(await this.candidateSkillRepository.save(candidateSkill))
    }

    async deleteSkill(id: number): Promise<SkillResponse> {
        const skill = await this.getSkillEntityById(id);
        await this.skillsRepository.remove(skill);
        return this.toSkillResponse(skill);
    }

    async deleteJobSkill(jobId: number, skillId: number): Promise<JobSkillResponse> {
        const jobSkill = await this.getJobSkillEntityById(jobId, skillId);
        await this.jobSkillRepository.remove(jobSkill);
        return this.toJobSkillResponse(jobSkill);
    }

    async deleteCandidateSkill(candidateId: number, skillId: number): Promise<CandidateSkillResponse> {
        const candidateSkill = await this.getCandidateSkillEntityById(candidateId, skillId);
        await this.candidateSkillRepository.remove(candidateSkill);
        return this.toCandidateSkillResponse(candidateSkill);
    }
}