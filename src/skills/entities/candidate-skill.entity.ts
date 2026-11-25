import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Candidate } from "../../candidates/entities/candidate.entity";
import { Skill } from "./skill.entity";

@Entity({ name: 'candidate_skills'})
export class CandidateSkill {
  @PrimaryColumn({ type: 'integer' })
  candidate_id!: number;

  @PrimaryColumn({ type: 'integer' })
  skill_id!: number;

  @Column({ type: 'integer', nullable: true })
  years_of_experience: number | null = null;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;
}
