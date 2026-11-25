export type UserRole = 'admin' | 'recruiter' | 'interviewer' | 'hiring_manager';

export interface User {
  id: number,
  email: string,
  password_hash: string | null,
  first_name: string,
  last_name: string | null,
  role: UserRole, 
  is_active: boolean,
  created_at: Date,
}