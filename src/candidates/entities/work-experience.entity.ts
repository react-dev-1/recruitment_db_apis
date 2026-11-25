import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidate } from "./candidate.entity";

@Entity({ name: 'work_experiences' })
export class WorkExperience {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'integer'})
  candidate_id!: number;

  @Column({type: 'text'})
  company_name!: string;

  @Column({type: 'text'})
  job_title!: string;

  @Column({type: 'date'})
  start_date!: Date;

  @Column({type: 'date', nullable: true})
  end_date: Date | null = null;

  @Column({type: 'boolean', default: true})
  is_current: boolean;

  @Column({type: 'text', nullable: true})
  description: string | null = null;

  @ManyToOne(() => Candidate, (c) => c.workExperience)
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;
}
