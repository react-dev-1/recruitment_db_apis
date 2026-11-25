export type JobStatus = 'open' | 'closed' | 'paused';

export interface Job {
  id: number,
  hiring_manager_id: number,
  title: string,
  description: string | null,
  requirements: string | null,
  employment_type: string | null,
  experience_level: string | null,
  salary_min: number | null,
  salary_max: number | null,
  status: JobStatus | null,
}

export interface JobPosting {
  id: number,
  job_id: number,
  platform_name: string | null,
  post_url: string | null,
  published_at: Date,
  expires_at: Date | null
}