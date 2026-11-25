import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Job as JobEntity } from "./entities/job.entity";
import { JobPosting as JobPostingEntity } from "./entities/job-posting.entity";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateJobDTO } from "./dto/create-job.dto";
import { UsersService } from "../users/users.service";
import { CreateJobPostingDTO } from "./dto/create-job-posting.dto";
import { UpdateJobPostingDTO } from "./dto/update-job-posting.dto";
import { UpdateJobDTO } from "./dto/update-job.dto";
import { CreateJobInfoDto } from "./dto/create-job-info.dto";
import { UpdateJobInfoDTO } from "./dto/update-job-info.dto";

export type JobResponse = Pick<
    JobEntity,
    "id" | "title" | "description" | "requirements" | "employment_type" | "experience_level" | "salary_min" | "salary_max" | "status"
>

type JobPostingResponse = Pick<
    JobPostingEntity,
    "id" | "job_id" | "platform_name" | "post_url" | "published_at" | "expires_at"
>
@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(JobEntity)
        private readonly jobsRepository: Repository<JobEntity>,

        @InjectRepository(JobPostingEntity)
        private readonly jobPostingRepository: Repository<JobPostingEntity>,

        private readonly usersService: UsersService
    ) { }

    toJobResponse(job: JobEntity): JobResponse {
        return {
            id: job.id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            employment_type: job.employment_type,
            experience_level: job.experience_level,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            status: job.status
        }
    }

    private toJobPostingResponse(jobPosting: JobPostingEntity): JobPostingResponse {
        return {
            id: jobPosting.id,
            job_id: jobPosting.job_id,
            platform_name: jobPosting.platform_name,
            post_url: jobPosting.post_url,
            published_at: jobPosting.published_at,
            expires_at: jobPosting.expires_at,
        }
    }

    private async getJobEntityById(id: number): Promise<JobEntity> {
        const job = await this.jobsRepository.findOneBy({ id });

        if (!job) {
            throw new NotFoundException(`Job with ${id} not found`);
        }

        return job;
    }

    private async getJobPostingEntityById(id: number, jobId: number): Promise<JobPostingEntity> {
        const jobPosting = await this.jobPostingRepository.findOneBy({ id, job_id: jobId });

        if (!jobPosting) {
            throw new NotFoundException(`Job Posting with ${id} not found`);
        }

        return jobPosting;
    }

    async getJobById(id: number): Promise<JobResponse> {
        return this.toJobResponse(await this.getJobEntityById(id));
    }

    async getJobInfoById(id: number): Promise<{
        job:JobResponse,
        job_postings: JobPostingResponse[]
    }> {

        const job = await this.jobsRepository.findOne({
            where: {id},
            relations: { jobPosting: true }
        })

        if (!job) {
            throw new NotFoundException(`Job with ${id} not found`);
        }

        return {
            job: this.toJobResponse(job),
            job_postings: job.jobPosting.map((p) => this.toJobPostingResponse(p)) ?? []
        }
    }

    async getJobPostingById(id: number, jobId: number): Promise<JobPostingResponse> {
        return this.toJobPostingResponse(await this.getJobPostingEntityById(id, jobId));
    }

    async getAllJobs(): Promise<JobResponse[]> {
        const jobs = await this.jobsRepository.find()
        return await jobs.map((job) => this.toJobResponse(job));
    }

    async getAllJobsInfo() {
        const jobs = await this.jobsRepository.find({
            relations: { jobPosting: true }
        })

        return jobs.map((j) => ({
            ...this.toJobResponse(j),
            job_postings: j.jobPosting.map((p) => this.toJobPostingResponse(p))
        }))
    }

    async getAllJobPostings(jobId: number): Promise<JobPostingResponse[]> {
        const jobPosts = await this.jobPostingRepository.findBy({ job_id: jobId })
        return await jobPosts.map((jobPost) => this.toJobPostingResponse(jobPost));
    }

    async createJob(userId: number, dto: CreateJobDTO): Promise<JobResponse> {
        await this.usersService.getUserById(userId);

        const existingJob = await this.jobsRepository.findOneBy({ 
            title: dto.title,
            requirements: dto.requirements ? dto.requirements : IsNull() 
        });

        if (existingJob) {
            throw new ConflictException(`Job with title: ${dto.title} and reqirements: ${dto.requirements} already exists`);
        }

        const job = this.jobsRepository.create({
            hiring_manager_id: userId,
            title: dto.title,
            description: dto.description ?? null,
            requirements: dto.requirements ?? null,
            employment_type: dto.employment_type ?? null,
            experience_level: dto.experience_level ?? null,
            salary_min: dto.salary_min ?? null,
            salary_max: dto.salary_max ?? null,
            status: dto.status ?? null,
        })

        return this.toJobResponse(await this.jobsRepository.save(job));
    }

    async createJobInfo(userId: number, dto: CreateJobInfoDto): Promise<{
        job: JobResponse;
        job_postings: JobPostingResponse[];
    }> {
        this.usersService.getUserById(userId)
        const job = await this.createJob(userId, dto.job);

        const job_postings: JobPostingResponse[] = [];
        
        for (const jobPostingDTO of dto.job_postings ?? []) {
            job_postings.push(await this.createJobPosting(job.id, jobPostingDTO));
        }

        return { job, job_postings }
    }

    async createJobPosting(jobId: number, dto: CreateJobPostingDTO): Promise<JobPostingResponse> {
        await this.getJobEntityById(jobId);

        const jobPost = this.jobPostingRepository.create({
            job_id: jobId,
            platform_name: dto.platform_name ?? null,
            post_url: dto.post_url ?? null,
            published_at: dto.published_at ?? null,
            expires_at: dto.expires_at ?? null,
        })

        return this.toJobPostingResponse(await this.jobPostingRepository.save(jobPost))
    }

    async updateJob(id: number, dto: UpdateJobDTO): Promise<JobResponse> {
        // await this.usersService.getUserById(userId);
        const job = await this.getJobEntityById(id)

        Object.assign(job, {
            ...(dto.title !== undefined && { title: dto.title }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.requirements !== undefined && { requirements: dto.requirements }),
            ...(dto.employment_type !== undefined && { employment_type: dto.employment_type }),
            ...(dto.experience_level !== undefined && { experience_level: dto.experience_level }),
            ...(dto.salary_min !== undefined && { salary_min: dto.salary_min }),
            ...(dto.salary_max !== undefined && { salary_max: dto.salary_max }),
            ...(dto.status !== undefined && { status: dto.status }),
        })

        return this.toJobResponse(await this.jobsRepository.save(job))
    }

    async updateJobInfo(id: number, dto: UpdateJobInfoDTO): Promise<{
        job: JobResponse,
        job_postings: JobPostingResponse[]
    }> {
        let job: JobResponse;

        if (dto.job) {
            job = await this.updateJob(id, dto.job)
        } else {
            job = await this.getJobById(id);
        }

        const job_postings: JobPostingResponse[] = [];
        for (const jobPostingDTO of dto.job_postings ?? []) {
            if (jobPostingDTO.id) {
                job_postings.push(await this.updateJobPosting(jobPostingDTO.id, job.id, jobPostingDTO))
            }
        }

        return {job, job_postings}
    }

    async updateJobPosting(id: number, jobId: number, dto: UpdateJobPostingDTO): Promise<JobPostingResponse> {
        await this.getJobEntityById(jobId);
        const jobPosting = await this.getJobPostingEntityById(id, jobId);

        Object.assign(jobPosting, {
            ...(dto.platform_name !== undefined && { platform_name: dto.platform_name }),
            ...(dto.post_url !== undefined && { post_url: dto.post_url }),
            ...(dto.published_at !== undefined && { published_at: dto.published_at }),
            ...(dto.expires_at !== undefined && { expires_at: dto.expires_at }),
        });

        return this.toJobPostingResponse(await this.jobPostingRepository.save(jobPosting))
    }

    async deleteJob(id: number): Promise<JobResponse> {
        const job = await this.getJobEntityById(id);
        await this.jobsRepository.remove(job);
        return this.toJobResponse(job);
    }

    async deleteJobPosting(id: number, jobId: number): Promise<JobPostingResponse> {
        const jobPosting = await this.getJobPostingEntityById(id, jobId);
        await this.jobPostingRepository.remove(jobPosting);
        return this.toJobPostingResponse(jobPosting);
    }
}