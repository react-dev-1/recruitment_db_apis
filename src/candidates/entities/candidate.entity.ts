import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "../../applications/entities/application.entity";
import { Education } from "./education.entity";
import { Resume } from "./resume.entity";
import { WorkExperience } from "./work-experience.entity";
import { CandidateSkill } from "../../skills/entities/candidate-skill.entity";

// @Entity({ name: 'candidates' }) → table name is `candidates`.
// Without the argument, TypeORM would derive it from the class name.
@Entity({ name: 'candidates' })
export class Candidate {
  @PrimaryGeneratedColumn() // SERIAL / auto-increment integer PK
  id!: number;

  @Column({ type: 'text' }) // NOT NULL text column
  first_name!: string;

  @Column({ type: 'text', nullable: true }) 
  last_name: string | null = null;

  @Column({ type: 'text', unique: true }) // UNIQUE constraint → DB rejects dup emails
  email!: string;

  @Column({ type: 'text', nullable: true })
  phone: string | null = null;

  @Column({ type: 'text', nullable: true })
  linkedin_url: string | null = null;

  @Column({ type: 'text', nullable: true })
  portfolio_url: string | null = null;

  @Column({ type: 'text', nullable: true })
  address: string | null = null;

  @Column({ type: 'text' })
  city!: string;

  @Column({ type: 'text' })
  country!: string;

  // RELATIONS (one candidate → many X). The second argument is the inverse
  // side: "which property on the child points back to candidate"
  @OneToMany(() => Application, (a) => a.candidate)
  application!: Application[];

  @OneToMany(() => Education, (e) => e.candidate)
  education!: Education[];

  @OneToMany(() => Resume, (r) => r.candidate)
  resume!: Resume[];

  @OneToMany(() => WorkExperience, (w) => w.candidate)
  workExperience!: WorkExperience[];

  @OneToMany(() => CandidateSkill, (c) => c.candidate)
  candidateSkill!: CandidateSkill[];
}
