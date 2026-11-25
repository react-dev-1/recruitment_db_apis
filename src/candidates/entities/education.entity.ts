import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidate } from "./candidate.entity";

@Entity({ name: 'educations' })
export class Education {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'integer'})
  candidate_id!: number;

  @Column({type: 'text'})
  degree!: string;

  @Column({type: 'text'})
  institution!: string;

  @Column({type: 'text'})
  field_of_study!: string;

  @Column({type: 'date'})
  start_date!: Date;

  @Column({type: 'date', nullable: true})
  end_date: Date | null = null;

  @Column({type: 'text', nullable: true})
  grade: string | null = null;

  @ManyToOne(() => Candidate, (c) => c.education)
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;
}
