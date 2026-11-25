export interface Candidate {
  id: number,
  first_name: string,
  last_name: string | null,
  email: string,
  phone: string | null,
  linkedin_url: string | null,
  portfolio_url: string | null,
  address: string | null,
  city: string,
  country: string
}

export interface Education {
  id: number,
  candidate_id: number,
  degree: string,
  institution: string,
  field_of_study: string,
  start_date: Date,
  end_date: Date | null,
  grade: string | null
}

export interface WorkExperience {
  id: number,
  candidate_id: number,
  company_name: string,
  job_title: string,
  start_date: Date,
  end_date: Date | null,
  is_current: boolean,
  description: string | null
}

export interface Resume {
  id: number,
  candidate_id: number,
  file_name: string | null,
  file_path: string | null,
  parsed_text: string | null,
  uploaded_at: Date,
}
