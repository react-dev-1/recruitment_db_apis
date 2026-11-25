import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { UserRole } from "../user.type";
import { Job } from "../../jobs/entities/job.entity";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null = null;

  @Column({ type: 'text' })
  first_name!: string;

  @Column({ type: 'text', nullable: true  })
  last_name: string | null = null;

  @Column({ type: 'text' })
  role!: UserRole; 

  @Column({ type: 'boolean', default: true})
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @OneToMany(() => Job, (j) => j.user)
  job!: Job[];
}