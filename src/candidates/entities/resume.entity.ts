import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Candidate } from "./candidate.entity";

@Entity({ name: 'resumes' })
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  candidate_id!: number;

  @Column({ type: 'text', nullable: true })
  file_name: string | null = null;

  @Column({ type: 'text', nullable: true })
  file_path: string | null = null;

  @Column({ type: 'text', nullable: true })
  parsed_text: string | null = null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at!: Date;

  @ManyToOne(() => Candidate, (c) => c.resume)
  @JoinColumn({ name: 'candidate_id' })
  candidate!: Candidate;
}
