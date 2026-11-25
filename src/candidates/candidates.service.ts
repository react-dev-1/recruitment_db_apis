import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Candidate as CandidateEntity } from "./entities/candidate.entity";
import { Education as EducationEntity } from "./entities/education.entity";
import { WorkExperience as WorkExperienceEntity } from "./entities/work-experience.entity";
import { Resume as ResumeEntity } from "./entities/resume.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
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
import { CandidatesController } from "./candidates.controller";

export type CandidateResponse = Pick<
    CandidateEntity,
    "id" | "first_name" | "last_name" | "email" | "phone" | "linkedin_url" | "portfolio_url" | "address" | "city" | "country"
>

type EducationResponse = Pick<
    EducationEntity,
    "id" | "candidate_id" | "degree" | "institution" | "field_of_study" | "start_date" | "end_date" | "grade"
>

type WorkExpResponse = Pick<
    WorkExperienceEntity,
    "id" | "candidate_id" | "company_name" | "job_title" | "start_date" | "end_date" | "is_current" | "description"
>

type ResumeResponse = Pick<
    ResumeEntity,
    "id" | "candidate_id" | "file_name" | "file_path" | "parsed_text" | "uploaded_at"
>

@Injectable()
export class CandidatesService {
    constructor(
        @InjectRepository(CandidateEntity)
        private readonly candidatesRepository: Repository<CandidateEntity>,

        @InjectRepository(EducationEntity)
        private readonly educationRepository: Repository<EducationEntity>,

        @InjectRepository(WorkExperienceEntity)
        private readonly workExpRepository: Repository<WorkExperienceEntity>,

        @InjectRepository(ResumeEntity)
        private readonly resumeRespository: Repository<ResumeEntity>
    ) { }

    toCandidatesResponse(candidate: CandidateEntity): CandidateResponse {
        return {
            id: candidate.id,
            first_name: candidate.first_name,
            last_name: candidate.last_name,
            email: candidate.email,
            phone: candidate.phone,
            linkedin_url: candidate.linkedin_url,
            portfolio_url: candidate.portfolio_url,
            address: candidate.address,
            city: candidate.city,
            country: candidate.country
        }
    }

    private toEducationResponse(education: EducationEntity): EducationResponse {
        return {
            id: education.id,
            candidate_id: education.candidate_id,
            degree: education.degree,
            institution: education.institution,
            field_of_study: education.field_of_study,
            start_date: education.start_date,
            end_date: education.end_date,
            grade: education.grade
        }
    }

    private toWorkExpResponse(workExp: WorkExperienceEntity): WorkExpResponse {
        return {
            id: workExp.id,
            candidate_id: workExp.candidate_id,
            company_name: workExp.company_name,
            job_title: workExp.job_title,
            start_date: workExp.start_date,
            end_date: workExp.end_date,
            is_current: workExp.is_current,
            description: workExp.description
        }
    }

    private toResumeResponse(resume: ResumeEntity): ResumeResponse {
        return {
            id: resume.id,
            candidate_id: resume.candidate_id,
            file_name: resume.file_name,
            file_path: resume.file_path,
            parsed_text: resume.parsed_text,
            uploaded_at: resume.uploaded_at
        }
    }

    private async getCandidateEntityById(id: number): Promise<CandidateEntity> {
        const candidate = await this.candidatesRepository.findOneBy({ id });

        if (!candidate) {
            throw new NotFoundException(`Candidate with ${id} not found`);
        }

        return candidate;
    }

    private async getEducationEntityById(id: number, candidateId: number): Promise<EducationEntity> {
        const education = await this.educationRepository.findOneBy({ id, candidate_id: candidateId });

        if (!education) {
            throw new NotFoundException(`Education with ${id} not found`);
        }

        return education;
    }

    private async getWorkExpEntityById(id: number, candidateId: number): Promise<WorkExperienceEntity> {
        const workExp = await this.workExpRepository.findOneBy({ id, candidate_id: candidateId });

        if (!workExp) {
            throw new NotFoundException(`Work Experience with ${id} not found`);
        }

        return workExp;
    }

    private async getResumeEntityById(id: number, candidateId: number): Promise<ResumeEntity> {
        const resume = await this.resumeRespository.findOneBy({ id, candidate_id: candidateId });

        if (!resume) {
            throw new NotFoundException(`Resume with ${id} not found`);
        }

        return resume;
    }

    async getCandidateById(id: number): Promise<CandidateResponse> {
        // Note the composition: await the entity, feed it to the mapper.
        return this.toCandidatesResponse(await this.getCandidateEntityById(id));
    }

    async getCandidateInfoById(id: number) {
        const candidate = await this.candidatesRepository.findOne({
            where: {id},
            relations: {
                education: true,
                workExperience: true,
                resume: true
            }
        });

        if (!candidate) {
            throw new NotFoundException(`Candidate with ${id} not found`);
        }

        return {
            candidate: this.toCandidatesResponse(candidate),
            educations: candidate.education?.map((e) => this.toEducationResponse(e)) ?? [],
            workExps: candidate.workExperience?.map((w) => this.toWorkExpResponse(w)) ?? [],
            resumes: candidate.resume?.map((r) => this.toResumeResponse(r)) ?? [],
        }
    }

    async getEducationById(id: number, candidateId: number): Promise<EducationResponse> {
        return this.toEducationResponse(await this.getEducationEntityById(id, candidateId));
    }

    async getWorkExperienceById(id: number, candidateId: number): Promise<WorkExpResponse> {
        return this.toWorkExpResponse(await this.getWorkExpEntityById(id, candidateId));
    }

    async getResumeById(id: number, candidateId: number): Promise<ResumeResponse> {
        return this.toResumeResponse(await this.getResumeEntityById(id, candidateId));
    }

    async getAllCandidates(): Promise<CandidateResponse[]> {
        // find() = SELECT * FROM candidates
        const candidates = await this.candidatesRepository.find();
        // .map() creates a NEW array by running toCandidatesResponse on each
        // entity. It does NOT mutate the original array. Result type: CandidateResponse[].
        return candidates.map((candidate) => this.toCandidatesResponse(candidate))
    }

    async getAllCandidatesInfo() {
        const candidates = await this.candidatesRepository.find({
            relations: {
                education: true,
                workExperience: true,
                resume: true
            }
        });

        return candidates.map(c => ({ 
            ...this.toCandidatesResponse(c),
            educations: c.education.map((e) => this.toEducationResponse(e)),
            workExperience: c.workExperience.map((w) => this.toWorkExpResponse(w)),
            resume: c.resume.map((r) => this.toResumeResponse(r))
        }));
    }

    async getAllEducations(candidateId: number): Promise<EducationResponse[]> {
        const educations = await this.educationRepository.findBy({ candidate_id: candidateId });
        return educations.map((education) => this.toEducationResponse(education))
    }

    async getAllWorkExperiences(candidateId: number): Promise<WorkExpResponse[]> {
        const workExps = await this.workExpRepository.findBy({ candidate_id: candidateId });
        return workExps.map((WorkExp) => this.toWorkExpResponse(WorkExp))
    }

    async getAllResumes(candidateId: number): Promise<ResumeResponse[]> {
        const resumes = await this.resumeRespository.findBy({ candidate_id: candidateId });
        return resumes.map((resume) => this.toResumeResponse(resume))
    }

    async candidateEmailNotTaken(email: string): Promise<void> {
        const existingEmail = await this.candidatesRepository.findOne({ where: { email: email } });

        if (existingEmail) {
            throw new ConflictException(`Candidate with email ${email} already exists`)
        }
    }

    async createCandidate(dto: CreateCandidateDTO): Promise<CandidateResponse> {
        await this.candidateEmailNotTaken(dto.email);

        const candidate = this.candidatesRepository.create({
            first_name: dto.first_name,
            last_name: dto.last_name ?? null,
            email: dto.email,
            phone: dto.phone ?? null,
            linkedin_url: dto.linkedin_url ?? null,
            portfolio_url: dto.portfolio_url ?? null,
            address: dto.address ?? null,
            city: dto.city,
            country: dto.country,
        });

        return this.toCandidatesResponse(await this.candidatesRepository.save(candidate));
    }

    async createCandidateInfo(dto: CreateCandidateInfoDto): Promise<{
        candidate: CandidateResponse;
        educations: EducationResponse[];
        workExps: WorkExpResponse[];
        resumes: ResumeResponse[];
    }> {
        const candidate = await this.createCandidate(dto.candidate);

        const educations: EducationResponse[] = [];
        for (const educationDTO of dto.educations ?? []) {
            educations.push(await this.createEducation(candidate.id, educationDTO));
        }

        const workExps: WorkExpResponse[] = [];
        for (const workExpDTO of dto.work_experiences ?? []) {
            workExps.push(await this.createWorkExperience(candidate.id, workExpDTO));
        }

        const resumes: ResumeResponse[] = [];
        for (const resumeDTO of dto.resumes ?? []) {
            resumes.push(await this.createResume(candidate.id, resumeDTO));
        }
        
        return { candidate, educations, workExps, resumes }
    }

    async createEducation(candidateId: number, dto: CreateEducationDTO): Promise<EducationResponse> {
        await this.getCandidateEntityById(candidateId);

        const education = this.educationRepository.create({
            candidate_id: candidateId,
            degree: dto.degree,
            institution: dto.institution,
            field_of_study: dto.field_of_study,
            start_date: dto.start_date,
            end_date: dto.end_date ?? null,
            grade: dto.grade ?? null,
        });

        return this.toEducationResponse(await this.educationRepository.save(education));
    }

    async createWorkExperience(candidateId: number, dto: CreateWorkExperienceDTO): Promise<WorkExpResponse> {
        await this.getCandidateEntityById(candidateId);

        const workExperience = this.workExpRepository.create({
            candidate_id: candidateId,
            company_name: dto.company_name,
            job_title: dto.job_title,
            start_date: dto.start_date,
            end_date: dto.end_date ?? null,
            is_current: dto.is_current ?? true,
            description: dto.description ?? null,
        })

        return this.toWorkExpResponse(await this.workExpRepository.save(workExperience));
    }

    async createResume(candidateId: number, dto: CreateResumeDTO): Promise<ResumeResponse> {
        await this.getCandidateEntityById(candidateId);

        const Resume = this.resumeRespository.create({
            candidate_id: candidateId,
            file_name: dto.file_name ?? null,
            file_path: dto.file_path ?? null,
            parsed_text: dto.parsed_text ?? null,
            //   uploaded_at: dto.uploaded_at ?? new Date(),
        })

        return this.toResumeResponse(await this.resumeRespository.save(Resume));
    }

    async updateCandidate(candidateId: number, dto: UpdateCandidateDTO): Promise<CandidateResponse> {
        const candidate = await this.getCandidateEntityById(candidateId);

        if (dto.email !== undefined) {
            const existing = await this.candidatesRepository.findOne({
                where: { email: dto.email },
            });

            if (existing && existing.id !== candidateId) {
                throw new ConflictException(`Email ${dto.email} is already taken by another candidate`);
            }
        }

        Object.assign(candidate, {
            ...(dto.first_name !== undefined && { first_name: dto.first_name }),
            ...(dto.last_name !== undefined && { last_name: dto.last_name }),
            ...(dto.email !== undefined && { email: dto.email }),
            ...(dto.phone !== undefined && { phone: dto.phone }),
            ...(dto.linkedin_url !== undefined && { linkedin_url: dto.linkedin_url }),
            ...(dto.portfolio_url !== undefined && { portfolio_url: dto.portfolio_url }),
            ...(dto.address !== undefined && { address: dto.address }),
            ...(dto.city !== undefined && { city: dto.city }),
            ...(dto.country !== undefined && { country: dto.country }),
        });

        try {
            return this.toCandidatesResponse(await this.candidatesRepository.save(candidate));
        } catch(error) {
            throw new ConflictException(error);
        }
    }

    async updateCandidateInfo(id: number, dto: UpdateCandidateInfoDto): Promise<{
        candidate: CandidateResponse,
        educations: EducationResponse[],
        work_experiences: WorkExpResponse[],
        resumes: ResumeResponse[],
    }> {
        let candidate: CandidateResponse;
        
        if (dto.candidate) {
            candidate = await this.updateCandidate(id, dto.candidate)
        } else {
            candidate = await this.getCandidateById(id)
        }

        const educations: EducationResponse[] = [];
        for (const educationDTO of dto.educations ?? []) {
            if (educationDTO.id) {
                educations.push(await this.updateEducation(educationDTO.id, candidate.id, educationDTO))
            }
        }

        const work_experiences : WorkExpResponse[] = [];
        for (const workExpDTO of dto.work_experiences ?? []) {
            if (workExpDTO.id) {
                work_experiences.push(await this.updateWorkExperience(workExpDTO.id, candidate.id, workExpDTO))
            }
        }

        const resumes: ResumeResponse[] = [];
        for (const resumeDTO of dto.resumes ?? []) {
            if (resumeDTO.id) {
                resumes.push(await this.updateResume(resumeDTO.id, candidate.id, resumeDTO))
            }
        }

        return {
            candidate, educations, work_experiences, resumes,
        }
    }

    async updateEducation(id: number, candidateId: number, dto: UpdateEducationDTO): Promise<EducationResponse> {
        const education = await this.getEducationEntityById(id, candidateId);

        Object.assign(education, {
            ...(dto.degree !== undefined && { degree: dto.degree }),
            ...(dto.institution !== undefined && { institution: dto.institution }),
            ...(dto.field_of_study !== undefined && { field_of_study: dto.field_of_study }),
            ...(dto.start_date !== undefined && { start_date: dto.start_date }),
            ...(dto.end_date !== undefined && { end_date: dto.end_date }),
            ...(dto.grade !== undefined && { grade: dto.grade })
        })

        return this.toEducationResponse(await this.educationRepository.save(education));
    }

    async updateWorkExperience(id: number, candidateId: number, dto: UpdateWorkExperienceDTO): Promise<WorkExpResponse> {
        const workExp = await this.getWorkExpEntityById(id, candidateId);

        Object.assign(workExp, {
            ...(dto.company_name !== undefined && { company_name: dto.company_name }),
            ...(dto.job_title !== undefined && { job_title: dto.job_title }),
            ...(dto.start_date !== undefined && { start_date: dto.start_date }),
            ...(dto.end_date !== undefined && { end_date: dto.end_date }),
            ...(dto.is_current !== undefined && { is_current: dto.is_current }),
            ...(dto.description !== undefined && { description: dto.description }),
        })

        return this.toWorkExpResponse(await this.workExpRepository.save(workExp));
    }

    async updateResume(id: number, candidateId: number, dto: UpdateResumeDTO): Promise<ResumeResponse> {
        const resume = await this.getResumeEntityById(id, candidateId);

        Object.assign(resume, {
            ...(dto.file_name !== undefined && { file_name: dto.file_name }),
            ...(dto.file_path !== undefined && { file_path: dto.file_path }),
            ...(dto.parsed_text !== undefined && { parsed_text: dto.parsed_text }),
            //   ...(dto.uploaded_at !== undefined && {uploaded_at: dto.uploaded_at}),
        })

        return this.toResumeResponse(await this.resumeRespository.save(resume));
    }

    async deleteCandidate(id: number): Promise<CandidateResponse> {
        const candidate = await this.getCandidateEntityById(id);
        await this.candidatesRepository.remove(candidate);
        return this.toCandidatesResponse(candidate);
    }

    async deleteEducation(id: number, candidateId: number): Promise<EducationResponse> {
        const education = await this.getEducationEntityById(id, candidateId);
        await this.educationRepository.remove(education);
        return this.toEducationResponse(education);
    }

    async deleteWorkExperience(id: number, candidateId: number): Promise<WorkExpResponse> {
        const workExp = await this.getWorkExpEntityById(id, candidateId);
        await this.workExpRepository.remove(workExp);
        return this.toWorkExpResponse(workExp);
    }

    async deleteResume(id: number, candidateId: number): Promise<ResumeResponse> {
        const resume = await this.getResumeEntityById(id, candidateId);
        await this.resumeRespository.remove(resume);
        return this.toResumeResponse(resume);
    }
}