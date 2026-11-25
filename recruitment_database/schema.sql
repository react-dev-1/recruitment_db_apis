CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  role VARCHAR(50) CHECK (role IN ('admin', 'recruiter', 'interviewer', 'hiring_manager')) NOT NULL,
  is_active boolean DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
  id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  linkedin_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL
);

CREATE TABLE educations (
  id SERIAL NOT NULL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  grade VARCHAR(100)
);

CREATE TABLE work_experiences (
  id SERIAL NOT NULL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  company_name VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT
);

CREATE TABLE resumes (
  id SERIAL NOT NULL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  file_name VARCHAR(100),
  file_path VARCHAR(225),
  parsed_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL NOT NULL PRIMARY KEY,
  hiring_manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  requirements TEXT,
  employment_type VARCHAR(100),
  experience_level VARCHAR(100),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  status VARCHAR(100) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused'))
);

CREATE TABLE job_postings (
  id SERIAL NOT NULL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  platform_name VARCHAR(100),
  post_url VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
  id SERIAL NOT NULL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100),
  stage VARCHAR(100) DEFAULT 'applied' CHECK (stage IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected')),  
  status VARCHAR(50) NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'rejected', 'withdrawn', 'accepted')),
  rejection_reason TEXT,
  UNIQUE (candidate_id, job_id)
);

CREATE TABLE skills (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(100),
  category VARCHAR(100)
);

CREATE TABLE candidate_skills (
  candidate_id INTEGER NOT NULL REFERENCES candidates(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  years_of_experience INTEGER,
  PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE job_skills (
  job_id INTEGER NOT NULL REFERENCES jobs(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  importance VARCHAR(100) NOT NULL DEFAULT 'required'
    CHECK (importance IN ('required', 'preferred', 'optional')),
  PRIMARY KEY (job_id, skill_id)
);

