-- Applicants for Backend Developer.
SELECT c.first_name, c.last_name, c.email, a.applied_at, a.stage, a.status
FROM applications AS a
JOIN candidates AS c ON c.id = a.candidate_id
JOIN jobs AS j ON j.id = a.job_id
WHERE j.title = 'Backend Developer'
ORDER BY a.applied_at, c.last_name, c.first_name;

-- Jobs applied for by John Doe.
SELECT j.title, j.employment_type, j.experience_level,
       a.applied_at, a.stage, a.status
FROM applications AS a
JOIN jobs AS j ON j.id = a.job_id
JOIN candidates AS c ON c.id = a.candidate_id
WHERE c.email = 'john@example.com'
ORDER BY a.applied_at, j.title;

-- Application count per job
SELECT j.title, COUNT(a.id) AS application_count
FROM jobs AS j
LEFT JOIN applications AS a ON a.job_id = j.id
GROUP BY j.id, j.title
ORDER BY j.title;

-- Duplicate-handling handling - the following application is ignored by the unique candidate/job constraint.
INSERT INTO applications
    (candidate_id, job_id, applied_at, source, stage, status)
SELECT c.id, j.id, TIMESTAMP '2023-10-20 09:00:00',
       'Website', 'applied', 'in_progress'
FROM candidates AS c
CROSS JOIN jobs AS j
WHERE c.email = 'aisha@example.com'
  AND j.title = 'Backend Developer'
ON CONFLICT (candidate_id, job_id) DO NOTHING
RETURNING id;
