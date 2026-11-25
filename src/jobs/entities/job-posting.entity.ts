import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";

@Entity({ name: 'job_postings' })
export class JobPosting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  job_id!: number;

  @Column({ type: 'text', nullable: true })
  platform_name: string | null = null;

  @Column({ type: 'text', nullable: true })
  post_url: string | null = null;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  published_at: Date | null = null;

  @Column({ type: 'date', nullable: true })
  expires_at: Date | null = null;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: Job;
}