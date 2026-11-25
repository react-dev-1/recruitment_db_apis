import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { JobStatus } from "../job.type";
import { Application } from "../../applications/entities/application.entity";
import { User } from "../../users/entities/user.entity";
import { JobPosting } from "./job-posting.entity";
import { JobSkill } from "../../skills/entities/job-skill.entity";

@Entity({ name: 'jobs' })
@Unique(['title', 'requirements'])
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  hiring_manager_id!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null = null

  @Column({ type: 'text', nullable: true })
  requirements: string | null = null

  @Column({ type: 'text', nullable: true })
  employment_type: string | null = null

  @Column({ type: 'text', nullable: true })
  experience_level: string | null = null

  @Column({ type: 'integer', nullable: true })
  salary_min: number | null = null

  @Column({ type: 'integer', nullable: true })
  salary_max: number | null = null

  @Column({ type: 'text', nullable: true })
  status: JobStatus | null = null

  @ManyToOne(() => User, (u) => u.job)
  @JoinColumn({ name: 'hiring_manager_id' })
  user!: User;

  @OneToMany(() => Application, (a) => a.job)
  application!: Application[];

  @OneToMany(() => JobPosting, (p) => p.job)
  jobPosting!: JobPosting[];

  @OneToMany(() => JobSkill, (s) => s.job)
  jobSkill!: JobSkill[];
}
