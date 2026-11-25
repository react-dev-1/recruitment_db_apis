export type ApplicationStage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
export type ApplicationStatus = 'in_progress' | 'rejected' | 'withdrawn' | 'accepted';

export interface Application {
  id: number,
  candidate_id: number,
  job_id: number,
  applied_at: Date | null,
  source: string | null,
  stage: ApplicationStage | null,  
  status: ApplicationStatus,
  rejection_reason: string | null,
}