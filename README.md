# Recruitment Applications REST API

A NestJS and TypeScript API backed by PostgreSQL and TypeORM. It uses the recruitment schema and fictional seed data in [`recruitment_database`](./recruitment_database/README.md).

## Local setup

Requirements: Node.js, npm, and PostgreSQL.

1. Create a database and run the schema and sample data scripts from the repository root:

   ```powershell
   psql -d postgres -c "CREATE DATABASE recruitment_db;"
   psql -d recruitment_db -f .\recruitment_database\schema.sql
   psql -d recruitment_db -f .\recruitment_database\sample_data.sql
   ```

   These scripts are for a fresh database. The sample data inserts four candidates and four jobs; on a fresh setup, Jane Smith is candidate `3` and Backend Developer is job `1`.

2. Create a `.env` file in the repository root with connection details for that database:

   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_local_postgres_password
   DB_NAME=recruitment_db
   PORT=3000
   ```

3. Install dependencies and start the API:

   ```powershell
   npm install
   npm run start:dev
   ```

   The server listens on `http://localhost:3000` unless `PORT` is set differently. TypeORM's `synchronize` option is enabled in the current app configuration; this is suitable only for local development, not production.

## Application API

### Submit an application

`POST /applications/:candidateId/:jobId`

`candidateId` and `jobId` are integer IDs. The request body requires `status`; other fields are optional.

```powershell
curl.exe -i -X POST http://localhost:3000/applications/3/1 `
  -H "Content-Type: application/json" `
  -d '{"status":"in_progress","source":"Company Website","stage":"applied"}'
```

On success, NestJS returns `201 Created` with the saved application, for example:

```json
{
  "id": 5,
  "applied_at": "2026-11-25T03:11:00.000Z",
  "source": "Company Website",
  "stage": "applied",
  "status": "in_progress",
  "rejection_reason": null
}
```

Submitting the same candidate/job pair again returns `409 Conflict` for a sequential repeat and does not create another row:

```powershell
curl.exe -i -X POST http://localhost:3000/applications/3/1 `
  -H "Content-Type: application/json" `
  -d '{"status":"in_progress","source":"Company Website","stage":"applied"}'
```

The database has a `UNIQUE (candidate_id, job_id)` constraint as the final integrity guarantee. Valid integer IDs for a candidate or job that does not exist return `404 Not Found`. Invalid IDs, invalid JSON fields, or an invalid/missing `status` return `400 Bad Request`. The accepted `status` values are `in_progress`, `rejected`, `withdrawn`, and `accepted`; accepted `stage` values are `applied`, `screening`, `interview`, `offer`, `hired`, and `rejected`. `applied_at`, when provided, must be a date.

NestJS errors use its standard JSON response format, including `statusCode`, `message`, and `error`.

### Retrieve applications

The current implementation exposes:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/applications` | Return all applications |
| `GET` | `/applications/:id` | Return one application |
| `GET` | `/applications/all` | Returns all applications all applications with candidate and job data |
| `GET` | `/applications/:id/candidate/:candidateId` | Return one application for a candidate |
| `GET` | `/applications/:id/job/:jobId` | Return one application for a job |
| `GET` | `/applications/candidate/:candidateId` | Return all application for a candidate |
| `GET` | `/applications/job/:jobId` | Return all application for a job |
| `POST` | `/applications/:candidateId/:jobId` | Only creates an application for an existing candidate and job |
| `POST` | `/applications/:userId/info` | Create application along with candidate and job |
| `PATCH` | `/applications/info/:candidateId/:jobId` | Updates an application |
| `DELETE` | `/applications/info/:candidateId/:jobId` | Deletes an application |

## Useful commands

```powershell
npm run build
npm test
npm run test:e2e
```
