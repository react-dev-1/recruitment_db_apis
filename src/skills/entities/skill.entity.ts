import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CandidateSkill } from "./candidate-skill.entity";
import { JobSkill } from "./job-skill.entity";

@Entity({ name: 'skills'})
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: true })
  name: string | null = null;

  @Column({ type: 'text', nullable: true })
  category: string | null = null;

  @OneToMany(() => JobSkill, (j) => j.skill)
  jobSkill!: JobSkill[];

  @OneToMany(() => CandidateSkill, (c) => c.skill)
  candidateSkill!: CandidateSkill[];
}

