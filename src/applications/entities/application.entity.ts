import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import type { ApplicationStage, ApplicationStatus } from "../application.type";
import { Candidate } from "../../candidates/entities/candidate.entity";
import { Job } from "../../jobs/entities/job.entity";

@Entity({name: 'applications'})
@Unique([ 'candidate_id', 'job_id' ])
export class Application {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'integer'})
  candidate_id!: number;

  @Column({type: 'integer'})
  job_id!: number;

  @Column({type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  applied_at: Date | null = null;

  @Column({type: 'text', nullable: true})
  source: string | null = null;

  @Column({type: 'text', nullable: true})
  stage: ApplicationStage | null = null;  

  @Column({type: 'text'})
  status!: ApplicationStatus;

  @Column({type: 'text', nullable: true})
  rejection_reason: string | null = null;

  @ManyToOne(() => Candidate, (c) => c.application)
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;

  @ManyToOne(() => Job, (j) => j.application)
  @JoinColumn({ name: 'job_id' })
  job!: Job;
}