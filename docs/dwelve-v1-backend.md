# Dwelve v1 Backend

## 1. Purpose

The Dwelve backend powers the v1 web platform for creating, delivering, grading, and analyzing online tests, exams, homework, and assignments.

For v1, the backend should focus on being reliable, simple to deploy, and easy to connect with the frontend. The goal is not to build every dream feature immediately, because apparently humans enjoy turning MVPs into aircraft carriers.

## 2. Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT access and refresh tokens
- **Session/token storage:** Redis
- **API style:** REST
- **Validation:** DTO-based validation
- **Documentation:** Swagger/OpenAPI
- **Deployment target:** VPS, managed server, Render/Fly/Railway, or similar Node.js hosting

## 3. Core Backend Modules

### 3.1 Auth

The auth system should support:

- Register
- Login
- Logout
- Refresh token
- Get current user
- Password hashing
- JWT access token generation
- Refresh token storage and invalidation
- Email verification or signup completion flow, if enabled

Important rule:

> A user should not directly have a global role like `student`, `teacher`, or `admin`.

Roles should belong to the user's membership inside a workspace.

Correct model:

```txt
User
Workspace
WorkspaceMember
```

Example:

```txt
Abdulaziz can be an admin in Workspace A
Abdulaziz can be a teacher in Workspace B
Abdulaziz can be a student in Workspace C
```

That role belongs to `WorkspaceMember`, not `User`.

## 4. Multi-Tenant Workspace Model

Dwelve v1 should support schools, learning centers, or private organizations through workspaces.

### Main entities

```txt
User
Workspace
WorkspaceMember
Invitation
Class / Group
Assignment
Exam / Test
Question
Submission
Answer
Grade / Result
```

### Workspace roles

Recommended v1 roles:

```txt
OWNER
ADMIN
TEACHER
STUDENT
```

### Role permissions

| Role | Permissions |
|---|---|
| OWNER | Full control of workspace, billing, members, content |
| ADMIN | Manage teachers, students, classes, exams, analytics |
| TEACHER | Create exams, assignments, questions, grade submissions |
| STUDENT | Join classes, take tests, view results |

## 5. v1 API Scope

### Auth APIs

```http
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

### Workspace APIs

```http
POST /workspaces
GET  /workspaces
GET  /workspaces/:workspaceId
PATCH /workspaces/:workspaceId
DELETE /workspaces/:workspaceId
```

### Member APIs

```http
GET    /workspaces/:workspaceId/members
POST   /workspaces/:workspaceId/invitations
PATCH  /workspaces/:workspaceId/members/:memberId/role
DELETE /workspaces/:workspaceId/members/:memberId
```

### Class / Group APIs

```http
POST   /workspaces/:workspaceId/classes
GET    /workspaces/:workspaceId/classes
GET    /classes/:classId
PATCH  /classes/:classId
DELETE /classes/:classId
POST   /classes/:classId/students
DELETE /classes/:classId/students/:studentId
```

### Exam / Assignment APIs

```http
POST   /workspaces/:workspaceId/exams
GET    /workspaces/:workspaceId/exams
GET    /exams/:examId
PATCH  /exams/:examId
DELETE /exams/:examId
POST   /exams/:examId/publish
```

### Question APIs

```http
POST   /exams/:examId/questions
GET    /exams/:examId/questions
PATCH  /questions/:questionId
DELETE /questions/:questionId
```

### Submission APIs

```http
POST /exams/:examId/submissions/start
POST /submissions/:submissionId/answers
POST /submissions/:submissionId/submit
GET  /submissions/:submissionId
GET  /exams/:examId/submissions
```

### Result APIs

```http
GET /submissions/:submissionId/result
GET /students/:studentId/results
GET /classes/:classId/results
```

### Analytics APIs

```http
GET /workspaces/:workspaceId/analytics/overview
GET /classes/:classId/analytics
GET /exams/:examId/analytics
```

## 6. Database

### Required production database

Use PostgreSQL.

For early v1, choose either:

- Managed PostgreSQL from the deployment platform
- Supabase PostgreSQL
- Neon PostgreSQL
- Railway PostgreSQL
- VPS-hosted PostgreSQL

For the simplest production launch, managed PostgreSQL is better. Self-hosted PostgreSQL is cheaper but makes you responsible for backups, updates, monitoring, and all the tiny fires humans pretend are “DevOps experience.”

### Local development

Use Docker Compose:

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dwelve
      POSTGRES_PASSWORD: dwelve
      POSTGRES_DB: dwelve_dev

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

## 7. Environment Variables

Example `.env`:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL="postgresql://dwelve:dwelve@localhost:5432/dwelve_dev"

REDIS_URL="redis://localhost:6379"

JWT_ACCESS_SECRET="replace-this-access-secret"
JWT_REFRESH_SECRET="replace-this-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CORS_ORIGIN="http://localhost:3000"

APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"

SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Dwelve <no-reply@dwelve.app>"
```

Production `.env` must use real secrets and production URLs.

Never commit `.env` files.

## 8. Local Development Setup

```bash
npm install
docker compose up -d
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Swagger should be available at:

```txt
http://localhost:4000/docs
```

Or whichever Swagger route is configured.

## 9. Production Build

```bash
npm install
npx prisma generate
npm run build
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start production server:

```bash
npm run start:prod
```

## 10. Deployment Checklist

Before production release:

- [ ] PostgreSQL production database is created
- [ ] Redis production instance is created
- [ ] Production environment variables are added
- [ ] `DATABASE_URL` points to production database
- [ ] Prisma migrations are deployed
- [ ] CORS allows only the production frontend domain
- [ ] JWT secrets are strong and private
- [ ] Swagger is protected or disabled in production
- [ ] Rate limiting is enabled for auth routes
- [ ] Error logs are visible
- [ ] Database backups are enabled
- [ ] Health check route exists
- [ ] Frontend uses the production API URL

Recommended health route:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "dwelve-backend",
  "database": "connected",
  "redis": "connected"
}
```

## 11. Security Rules

Minimum v1 security requirements:

- Hash all passwords
- Never return password hashes from APIs
- Use access and refresh tokens
- Store refresh sessions in Redis or database
- Validate all request bodies
- Check workspace membership before accessing workspace data
- Check role permissions before allowing mutations
- Use CORS properly
- Do not expose internal errors to users
- Rate-limit login and register endpoints
- Use HTTPS in production

## 12. Authorization Pattern

Every workspace-related route should verify:

1. User is authenticated
2. User belongs to the workspace
3. User has the required workspace role
4. User can access the requested resource

Example:

```txt
Request: PATCH /exams/:examId

Backend checks:
- Is the user logged in?
- Which workspace owns this exam?
- Is the user a member of that workspace?
- Is the user OWNER, ADMIN, or TEACHER?
- If yes, allow update.
```

## 13. Error Response Format

Use consistent errors:

```json
{
  "statusCode": 400,
  "message": "Invalid request body",
  "error": "Bad Request"
}
```

For custom app errors:

```json
{
  "code": "WORKSPACE_ACCESS_DENIED",
  "message": "You do not have access to this workspace."
}
```

## 14. v1 Release Priorities

### Must-have

- Auth
- Workspace creation
- Workspace membership
- Role-based access control
- Class/group management
- Exam/assignment creation
- Question creation
- Student submissions
- Basic auto-grading
- Basic results
- Basic analytics
- Production deployment

### Should-have

- Invitations
- Question bank
- Timed exams
- Manual grading
- PDF import foundation
- Email notifications

### Later

- Advanced AI explanations
- Full PDF-to-test automation
- Advanced analytics
- Payments/subscriptions
- Parent accounts
- Mobile app

## 15. Suggested v1 Hosting

Simple production setup:

```txt
Frontend: Vercel
Backend: Render / Railway / Fly.io / VPS
Database: Supabase / Neon / Railway PostgreSQL
Redis: Upstash / Railway Redis
Storage: S3-compatible storage later, only when file upload is needed
```

You do not need to buy a physical server. This is not 2006, mercifully.

## 16. Approximate Monthly Cost

For early v1:

| Service | Low-cost estimate |
|---|---:|
| Frontend hosting | $0 - $20 |
| Backend hosting | $5 - $25 |
| PostgreSQL | $0 - $25 |
| Redis | $0 - $10 |
| Domain | Around $10 - $20 per year |
| Email service | $0 - $15 |
| Storage | $0 - $5 initially |

Expected early monthly cost:

```txt
$10 - $60/month
```

If traffic grows:

```txt
$80 - $200+/month
```

## 17. Backend Definition of Done

Backend v1 is ready when:

- The frontend can register and log in users
- Users can create or join a workspace
- Workspace roles work correctly
- Teachers/admins can create classes and exams
- Students can take exams
- Results are saved and visible
- Analytics endpoints return useful summaries
- Production API is deployed
- Production database migrations work
- Errors are handled consistently
- Basic security is in place
