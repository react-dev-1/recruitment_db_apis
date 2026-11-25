# Recruitment Database Exercise

The core tables are:

- `candidates` - one row per candidate. Email is unique with phone, LinkedIn, and portfolio being optional.
- `jobs` - one row per job opening, with its hiring manager, requirements, salary range, and status.
- `applications` - the junction table between candidates and jobs. Each application refers to one candidate and one joband.

One candidate can apply to many jobs, and one job can receive applications from many candidates. The relationship between the core tables are established by foreign keys. The `UNIQUE (candidate_id, job_id)` constraint on `applications` prevents a candidate from applying to the same job more than once. 

The other tables hold staff (users), education, work experience, resumes, job postings, and skill requirements. `candidate_skills` and `job_skills` are junction tables for the many-to-many relationships between candidate/jobs and skills.
The role, job status, application stage, and skill importance values are restricted by `CHECK` constraints.

`candidate_skills` has a composite primary key on `(candidate_id, skill_id)` which are foreign keys to `candidates` and `skills`. `job_skills` works the same way for `(job_id, skill_id)`, referencing `jobs` and `skills` tables.


## Run order

Use pgAdmin or another PostgreSQL client. For a clean first run:

1. Connect to the default `postgres` database and create a database or execute only `CREATE DATABASE recruitment_db;` to create one. 
2. Connect to `recruitment_db`. Run the `CREATE TABLE` statements in `schema.sql`, starting at `CREATE TABLE users`.
3. Run `sample_data.sql` after creating all tables. Since the IDs are to be generated automatically the insert statements omit the ID columns.
4. Run `queries.sql` to inspect each result set.

The above schema and seed scripts are intended to be run once on an empty database, and re-running it in the same database will fail due to existing database and tables, or duplicate sample rows may violate constraints.

## SQL scripts and queries

### What each script does

- `schema.sql` creates the database tables, primary keys, foreign keys, and constraints.
- `sample_data.sql` inserts sample users, candidates, jobs, applications, skills, and related records. ID columns are auto-incremented by PostgreSQL.
- `queries.sql` runs the three queries below and one duplicate-application.

### Queries in `queries.sql`

1. **Applicants for Backend Developer -** joins applications, candidates, and jobs to list the applicants for this job.
2. **Jobs applied for by John -** joins applications, jobs, and candidates, filtered by John's email.
3. **Application count per job -** uses a `LEFT JOIN` so jobs with no applicants appear with a count of zero.
4. **Duplicate application demo -** query to insert existing Backend Developer application. The unique constraint on `(candidate_id, job_id)` prevents the duplicate and `ON CONFLICT DO NOTHING` makes the statement return no row instead of an error.


