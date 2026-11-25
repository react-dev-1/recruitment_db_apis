import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { JobSkillImportance } from "../skill.type";
import { Job } from "../../jobs/entities/job.entity";
import { Skill } from "./skill.entity";

@Entity({ name: 'job_skills'})
export class JobSkill {
   @PrimaryColumn({ type: 'integer' })
  job_id!: number;

   @PrimaryColumn({ type: 'integer' })
  skill_id!: number;

  @Column({ type: 'text' })
  importance!: JobSkillImportance | 'required';

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: Job;
  
  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;
}