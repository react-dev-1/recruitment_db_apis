BEGIN;

INSERT INTO users
    (email, password_hash, first_name, last_name, role, is_active, created_at)
VALUES
    ('john@company.com', 'sample_hash_john', 'john', 'Perera',
     'hiring_manager', TRUE, TIMESTAMP '2023-10-01 09:00:00'),
    ('admin@company.com', 'sample_hash_admin', 'System', 'Admin',
     'admin', TRUE, TIMESTAMP '2023-10-01 09:00:00');

INSERT INTO candidates
    (first_name, last_name, email, phone, linkedin_url, portfolio_url,
     city, country)
VALUES
    ('Aisha', 'Najeeb', 'aisha@example.com', '0771234567',
     'https://linkedin.com/in/aisha', 'https://aisha.dev/', 'Colombo', 'Sri Lanka'),
    ('John', 'Doe', 'john@example.com', '0719876543',
     'https://linkedin.com/in/johndoe', NULL, 'New York', 'USA'),
    ('Jane', 'Smith', 'jane@example.com', NULL,
     NULL, NULL, 'London', 'UK'),
    ('Priya', 'Fernando', 'priya@example.com', '0777654321',
     'https://linkedin.com/in/priya-fernando', NULL, 'Kandy', 'Sri Lanka');

INSERT INTO educations
    (candidate_id, institution, degree, field_of_study, start_date, end_date, grade)
VALUES
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     'University of Colombo', 'BSc', 'Computer Science',
     DATE '2017-01-01', DATE '2021-01-01', '3.8 GPA'),
    ((SELECT id FROM candidates WHERE email = 'john@example.com'),
     'MIT', 'BSc', 'Software Engineering',
     DATE '2015-09-01', DATE '2019-06-01', '3.5 GPA'),
    ((SELECT id FROM candidates WHERE email = 'priya@example.com'),
     'University of Peradeniya', 'BSc', 'Information Technology',
     DATE '2018-01-01', DATE '2022-01-01', '3.6 GPA');

INSERT INTO work_experiences
    (candidate_id, company_name, job_title, start_date, end_date, is_current, description)
VALUES
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     'TechCorp', 'Junior Dev', DATE '2021-02-01', DATE '2023-01-01',
     FALSE, 'Wrote backend code'),
    ((SELECT id FROM candidates WHERE email = 'john@example.com'),
     'StartupX', 'Backend Dev', DATE '2023-01-15', NULL,
     TRUE, 'Managing databases'),
    ((SELECT id FROM candidates WHERE email = 'jane@example.com'),
     'WebAgency', 'Web Dev', DATE '2019-07-01', DATE '2023-05-01',
     FALSE, 'Built HTML/CSS sites'),
    ((SELECT id FROM candidates WHERE email = 'priya@example.com'),
     'QualityWorks', 'QA Engineer', DATE '2022-03-01', NULL,
     TRUE, 'Tests web applications and APIs');

INSERT INTO resumes (candidate_id, file_name, file_path, parsed_text, uploaded_at)
VALUES
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     'aisha_resume.pdf', '/uploads/aisha.pdf',
     'Experienced backend developer...', TIMESTAMP '2023-10-15 09:55:00'),
    ((SELECT id FROM candidates WHERE email = 'john@example.com'),
     'john_resume.docx', '/uploads/john.docx',
     'Frontend developer with 4 years...', TIMESTAMP '2023-10-16 11:25:00'),
    ((SELECT id FROM candidates WHERE email = 'priya@example.com'),
     'priya_resume.pdf', '/uploads/priya.pdf',
     'Quality assurance engineer with API testing experience...', TIMESTAMP '2023-10-18 08:30:00');

INSERT INTO jobs
    (hiring_manager_id, title, description, requirements, employment_type,
     experience_level, salary_min, salary_max, status)
VALUES
    ((SELECT id FROM users WHERE email = 'john@company.com'),
     'Backend Developer', 'Build APIs', 'Python, SQL',
     'Full-time', 'Mid', 80000.00, 120000.00, 'open'),
    ((SELECT id FROM users WHERE email = 'john@company.com'),
     'Frontend Developer', 'Build UI', 'React, CSS',
     'Full-time', 'Junior', 60000.00, 90000.00, 'open'),
    ((SELECT id FROM users WHERE email = 'admin@company.com'),
     'Data Scientist', 'Analyze data', 'ML, Python',
     'Contract', 'Senior', 100000.00, 150000.00, 'closed'),
    ((SELECT id FROM users WHERE email = 'john@company.com'),
     'QA Engineer', 'Test web applications and APIs', 'Testing, SQL',
     'Full-time', 'Mid', 75000.00, 105000.00, 'open');

INSERT INTO job_postings (job_id, platform_name, post_url, published_at, expires_at)
VALUES
    ((SELECT id FROM jobs WHERE title = 'Backend Developer'),
     'LinkedIn', 'https://linkedin.com/jobs/123',
     TIMESTAMP '2023-10-10 08:00:00', TIMESTAMP '2023-11-10 08:00:00'),
    ((SELECT id FROM jobs WHERE title = 'Backend Developer'),
     'Indeed', 'https://indeed.com/jobs/456',
     TIMESTAMP '2023-10-11 09:00:00', TIMESTAMP '2023-11-11 09:00:00'),
    ((SELECT id FROM jobs WHERE title = 'Frontend Developer'),
     'LinkedIn', 'https://linkedin.com/jobs/789',
     TIMESTAMP '2023-10-12 10:00:00', TIMESTAMP '2023-11-12 10:00:00'),
    ((SELECT id FROM jobs WHERE title = 'QA Engineer'),
     'Glassdoor', 'https://glassdoor.com/job/101',
     TIMESTAMP '2023-10-18 08:00:00', TIMESTAMP '2023-11-18 08:00:00');

INSERT INTO applications
    (candidate_id, job_id, applied_at, source, stage, status, rejection_reason)
VALUES
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     (SELECT id FROM jobs WHERE title = 'Backend Developer'),
     TIMESTAMP '2023-10-15 10:00:00', 'LinkedIn', 'interview', 'in_progress', NULL),
    ((SELECT id FROM candidates WHERE email = 'john@example.com'),
     (SELECT id FROM jobs WHERE title = 'Backend Developer'),
     TIMESTAMP '2023-10-16 11:30:00', 'Referral', 'screening', 'in_progress', NULL),
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     (SELECT id FROM jobs WHERE title = 'Frontend Developer'),
     TIMESTAMP '2023-10-17 09:15:00', 'Website', 'applied', 'rejected',
     'Lack of React experience'),
    ((SELECT id FROM candidates WHERE email = 'priya@example.com'),
     (SELECT id FROM jobs WHERE title = 'QA Engineer'),
     TIMESTAMP '2023-10-19 10:00:00', 'Company Website', 'screening', 'in_progress', NULL);

INSERT INTO skills (name, category)
VALUES
    ('PostgreSQL', 'Database'),
    ('Python', 'Programming'),
    ('React', 'Frontend'),
    ('SQL', 'Database'),
    ('Testing', 'Quality Assurance');

INSERT INTO candidate_skills (candidate_id, skill_id, years_of_experience)
VALUES
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     (SELECT id FROM skills WHERE name = 'PostgreSQL'), 3),
    ((SELECT id FROM candidates WHERE email = 'aisha@example.com'),
     (SELECT id FROM skills WHERE name = 'Python'), 4),
    ((SELECT id FROM candidates WHERE email = 'john@example.com'),
     (SELECT id FROM skills WHERE name = 'Python'), 1),
    ((SELECT id FROM candidates WHERE email = 'priya@example.com'),
     (SELECT id FROM skills WHERE name = 'Testing'), 3);

INSERT INTO job_skills (job_id, skill_id, importance)
VALUES
    ((SELECT id FROM jobs WHERE title = 'Backend Developer'),
     (SELECT id FROM skills WHERE name = 'PostgreSQL'), 'required'),
    ((SELECT id FROM jobs WHERE title = 'Backend Developer'),
     (SELECT id FROM skills WHERE name = 'Python'), 'required'),
    ((SELECT id FROM jobs WHERE title = 'Backend Developer'),
     (SELECT id FROM skills WHERE name = 'SQL'), 'required'),
    ((SELECT id FROM jobs WHERE title = 'Frontend Developer'),
     (SELECT id FROM skills WHERE name = 'React'), 'required'),
    ((SELECT id FROM jobs WHERE title = 'QA Engineer'),
     (SELECT id FROM skills WHERE name = 'Testing'), 'required'),
    ((SELECT id FROM jobs WHERE title = 'QA Engineer'),
     (SELECT id FROM skills WHERE name = 'SQL'), 'preferred');

COMMIT;
