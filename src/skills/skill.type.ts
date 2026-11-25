export type JobSkillImportance = 'required' | 'preferred' | 'optional';

export interface Skill {
  id: number,
  name: string | null,
  category: string | null
}

export interface CandidateSkill {
  candidate_id: number,
  skill_id: number,
  years_of_experience: number | null
}

export interface JobSkill {
  job_id: number,
  skill_id: number,
  importance: JobSkillImportance | 'required'
}