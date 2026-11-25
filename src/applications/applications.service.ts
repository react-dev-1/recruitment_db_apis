import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Application as ApplicationEntity } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDTO } from './dto/create-application.dto';
import { CandidateResponse, CandidatesService } from '../candidates/candidates.service';
import { JobResponse, JobsService } from '../jobs/jobs.service';
import { UpdateApplicationDTO } from './dto/update-application.dto';
import { CreateApplicationInfoDTO } from './dto/create-application-info.dto';
import { UpdateApplicationInfoDTO } from './dto/update-application-info.dto';

type ApplicationResponse = Pick<
  ApplicationEntity,
  'id' | 'applied_at' | 'source' | 'stage' | 'status' | 'rejection_reason' | 'candidate' | 'job'
>;

type JobWithApplicationsResponse = JobResponse & {
  applications: ApplicationResponse[]
}

type CandidateWithApplicationResponse = CandidateResponse & {
  applications: ApplicationResponse[]
}

type ApplicationInfoResponse = CandidateResponse & JobResponse & {
  applications: ApplicationResponse[]
}

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly candidatesService: CandidatesService,
    private readonly jobsService: JobsService,
  ) {}

  private toApplicationResponse(
    application: ApplicationEntity,
  ): ApplicationResponse {
    return {
      id: application.id,
      applied_at: application.applied_at,
      source: application.source,
      stage: application.stage,
      status: application.status,
      rejection_reason: application.rejection_reason,
      candidate: application.candidate,
      job: application.job,
    };
  }

  private async getApplicationEntityById(
    id: number,
  ): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findOneBy({ id });

    if (!application) {
      throw new NotFoundException(`Application with ${id} not found`);
    }

    return application;
  }

  async getApplicationById(id: number): Promise<ApplicationResponse> {
    return this.toApplicationResponse(await this.getApplicationEntityById(id));
  }

  async getApplicationByCandidateJob(candidateId: number, jobId: number): Promise<ApplicationInfoResponse> {
    const candidate = await this.candidatesService.getCandidateById(candidateId);
    const job = await this.jobsService.getJobById(jobId);

    const application = await this.applicationRepository.findOne({
      where: { candidate_id: candidate.id, job_id: job.id},
      relations: { candidate: true, job: true}
    })

    if (!application) {
      throw new NotFoundException(`Application not found`);
    }

    return {
      ...candidate,
      ...job,
      applications: [application]
    };
  }

  async getApplicationByCandidate(id: number, candidateId: number): Promise<{
    application: ApplicationResponse
  }> {
    await this.candidatesService.getCandidateById(candidateId);

    const application = await this.applicationRepository.findOne({
      where: { id, candidate_id: candidateId },
      relations: { candidate: true }
    })

    if (!application) {
      throw new NotFoundException(`Application with ${id} not found`);
    }

    return {
      application: this.toApplicationResponse(application)
    }
  }

  async getApplicationByJob(id: number, jobId: number): Promise<{
    application: ApplicationResponse
  }> {
    const job = await this.jobsService.getJobById(jobId);
    
    const application = await this.applicationRepository.findOne({
      where: {id, job_id: jobId},
      relations: {job: true}
    })

    if (!application) {
      throw new NotFoundException(`Application with ${id} not found`);
    }

    return {
      application: this.toApplicationResponse(application)
    }
  }

  async getAllApplicationsByCandidate(candidateId: number): Promise<{
    candidate: CandidateWithApplicationResponse,
  }> {
    const candidate = await this.candidatesService.getCandidateById(candidateId);

    const applications = await this.applicationRepository.find({
      where: { candidate_id: candidateId}
    })

    return {
      candidate: {
        ...candidate,
        applications: applications.map((a) => this.toApplicationResponse(a))
      }
    }
  }

  async getAllApplicationsByJob(jobId: number): Promise<{
    job: JobWithApplicationsResponse
  }> {
    const job = await this.jobsService.getJobById(jobId);

    const applications = await this.applicationRepository.find({
      where: { job_id: jobId }
    })

    return {
      job: {
        ...job,
        applications: applications.map((a) => this.toApplicationResponse(a))
      }
    }
  }

  async getAllApplicationInfos() {
    const applications = await this.applicationRepository.find({
      relations: { job: true, candidate: true}
    })

    return applications.map((a) => ({
      ...this.toApplicationResponse(a),
      job: this.jobsService.toJobResponse(a.job),
      candidate: this.candidatesService.toCandidatesResponse(a.candidate)
    }));
  }

  async getAllApplications(): Promise<ApplicationResponse[]> {
    const applications = await this.applicationRepository.find();
    return applications.map((application) =>
      this.toApplicationResponse(application),
    );
  }

  async createApplication(candidateId: number, jobId: number, dto: CreateApplicationDTO): Promise<ApplicationResponse> {
    await this.candidatesService.getCandidateById(candidateId);
    await this.jobsService.getJobById(jobId);

    const existingApplicationForCandidate = await this.applicationRepository.findOneBy({candidate_id: candidateId, job_id: jobId});

    if (existingApplicationForCandidate) {
        throw new ConflictException(`Candidate has already applied for this job`);
    }

    const application = this.applicationRepository.create({
      candidate_id: candidateId,
      job_id: jobId,
      applied_at: dto.applied_at,
      source: dto.source,
      stage: dto.stage,
      status: dto.status,
      rejection_reason: dto.rejection_reason,
    });

    return this.toApplicationResponse(await this.applicationRepository.save(application));
  }

  async updateApplication(id: number, dto: UpdateApplicationDTO): Promise<ApplicationResponse> {
    const application = await this.getApplicationEntityById(id);

    const hasChanges = Object.values(dto).some(v => v !== undefined);
    if (!hasChanges) {
      return this.toApplicationResponse(application);
    }

    Object.assign(application, {
        ...(dto.applied_at !== undefined && {applied_at: dto.applied_at}),
        ...(dto.source !== undefined && {source: dto.source}),
        ...(dto.stage !== undefined && {stage: dto.stage}),
        ...(dto.status !== undefined && {status: dto.status}),
        ...(dto.rejection_reason !== undefined && {rejection_reason: dto.rejection_reason})
    });

    return this.toApplicationResponse(await this.applicationRepository.save(application));
  }

  async createApplicationInfo(userId: number, dto: CreateApplicationInfoDTO): Promise<ApplicationInfoResponse> {
    const candidate = await this.candidatesService.createCandidate(dto.candidate);
    const job = await this.jobsService.createJob(userId, dto.job);
    const application = await this.createApplication(candidate.id, job.id, dto.application)

    return {
      ...candidate,
      ...job,
      applications: [application]
    }
  }

  async updateApplicationInfo(candidateId: number, jobId: number, dto: UpdateApplicationInfoDTO): Promise<ApplicationInfoResponse> {
    const applicationData = await this.getApplicationByCandidateJob(candidateId, jobId);
    const applicationId = applicationData.applications[0].id;

    const candidate = dto.candidate 
      ? await this.candidatesService.updateCandidate(candidateId, dto.candidate)
      : await this.candidatesService.getCandidateById(candidateId);

    const job = dto.job 
      ? await this.jobsService.updateJob(jobId, dto.job)
      : await this.jobsService.getJobById(jobId);

    const application = dto.application 
      ? await this.updateApplication(applicationId, dto.application)
      : this.toApplicationResponse(await this.getApplicationEntityById(applicationId));

    return {
      ...candidate,
      ...job,
      applications: [application]
    }
  }

  async deleteApplication(id: number): Promise<ApplicationResponse> {
    const application = await this.getApplicationEntityById(id);
    await this.applicationRepository.remove(application);
    return this.toApplicationResponse(application);
  }
}
