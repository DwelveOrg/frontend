# Dwelve v1 Frontend

## 1. Purpose

The Dwelve frontend is the user-facing web app for teachers, students, admins, and learning centers.

For v1, the frontend should make the core flow clear:

```txt
Sign up → Create or join workspace → Create class → Create test → Student submits → Teacher views results
```

Everything else is secondary. Beautiful animations are nice, but users cannot grade homework with vibes. Tragic.

## 2. Tech Stack

- **Framework:** Next.js App Router
- **UI:** React
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + Radix UI
- **Forms:** react-hook-form
- **Validation:** zod
- **Auth/session support:** jose / secure session handling
- **Internationalization:** i18next / react-i18next
- **Theme:** next-themes
- **Animation:** motion
- **3D/visual effects:** three, only where useful

## 3. Main Frontend Areas

```txt
Landing page
Auth pages
Onboarding
Dashboard
Workspace management
Classes
Exams / assignments
Question editor
Student test-taking page
Results
Analytics
Settings
```

## 4. Recommended Route Structure

```txt
app/
  page.tsx

  auth/
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx

  onboarding/
    page.tsx

  dashboard/
    page.tsx

  workspaces/
    page.tsx
    [workspaceId]/
      page.tsx
      settings/
        page.tsx
      members/
        page.tsx
      classes/
        page.tsx
        [classId]/
          page.tsx
      exams/
        page.tsx
        new/
          page.tsx
        [examId]/
          page.tsx
          edit/
            page.tsx
          submissions/
            page.tsx
      analytics/
        page.tsx

  student/
    exams/
      [examId]/
        page.tsx
      [examId]/
        take/
          page.tsx
    results/
      page.tsx
```

This can be adjusted later, but v1 needs structure more than it needs cleverness.

## 5. Core User Flows

### 5.1 Registration

User signs up without choosing a permanent global role.

After signup, they should either:

1. Create a workspace, such as a school or learning center
2. Join an existing workspace through invite/code

Roles are assigned through workspace membership.

```txt
User signs up
↓
Onboarding page
↓
Create workspace OR join workspace
↓
Role is assigned in WorkspaceMember
```

### 5.2 Login

```txt
User enters email/password
↓
Frontend calls POST /auth/login
↓
Backend returns tokens/session
↓
Frontend stores session securely
↓
User is redirected to dashboard
```

### 5.3 Teacher creates a test

```txt
Teacher opens workspace
↓
Teacher opens Exams
↓
Teacher creates exam
↓
Teacher adds questions
↓
Teacher publishes exam
↓
Students can access it
```

### 5.4 Student takes a test

```txt
Student opens assigned exam
↓
Frontend starts submission
↓
Student answers questions
↓
Frontend saves answers
↓
Student submits
↓
Backend grades where possible
↓
Student sees result if allowed
```

### 5.5 Teacher views analytics

```txt
Teacher opens exam results
↓
Frontend fetches submissions/results
↓
Frontend displays score distribution, student list, weak questions
```

## 6. API Connection

Use one central API client.

Example environment variable:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Production:

```env
NEXT_PUBLIC_API_URL="https://api.dwelve.app"
```

Example API client:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
```

If tokens are stored in cookies, use:

```ts
credentials: "include"
```

If tokens are stored manually, attach the authorization header:

```ts
Authorization: `Bearer ${accessToken}`
```

For production, cookie-based auth is usually cleaner and safer.

## 7. Environment Variables

Example `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Example `.env.production`:

```env
NEXT_PUBLIC_API_URL="https://api.dwelve.app"
NEXT_PUBLIC_APP_URL="https://dwelve.app"
```

Do not expose backend secrets in frontend environment variables.

Anything starting with `NEXT_PUBLIC_` is visible in the browser. The browser is basically a glass house with JavaScript in it.

## 8. Pages Needed for v1

### Public pages

- Landing page
- Login
- Register
- Forgot password, optional for v1
- Privacy Policy
- Terms of Service

### Authenticated pages

- Dashboard
- Onboarding
- Workspace switcher
- Workspace settings
- Members page
- Classes page
- Class detail page
- Exams page
- Exam creation page
- Exam editor page
- Student exam-taking page
- Results page
- Analytics page
- Account settings

## 9. Landing Page Content Direction

The landing page should communicate:

- Create online tests and homework
- Generate tests faster
- Reduce paper-based checking
- Track student progress
- Use question banks
- Review student answers
- Support learning centers and teachers
- Future AI/PDF-to-test support

Suggested headline:

```txt
Create, deliver, and grade tests online.
```

Suggested subheadline:

```txt
Dwelve helps teachers and learning centers turn exams, homework, and practice tests into a faster digital workflow.
```

Suggested CTA:

```txt
Start for free
```

Secondary CTA:

```txt
See how it works
```

## 10. Dashboard v1

The dashboard should show different content based on workspace role.

### Owner/Admin dashboard

- Total teachers
- Total students
- Active classes
- Recent exams
- Recent submissions
- Basic workspace analytics

### Teacher dashboard

- My classes
- My exams
- Recent submissions
- Exams needing grading
- Student performance overview

### Student dashboard

- Assigned exams
- Upcoming deadlines
- Recent results
- Class list

## 11. UI Components

Recommended shared components:

```txt
AppShell
Sidebar
Topbar
WorkspaceSwitcher
UserMenu
RoleBadge
EmptyState
LoadingState
ErrorState
DataTable
ConfirmDialog
FormInput
FormTextarea
FormSelect
QuestionEditor
ExamCard
ClassCard
ResultCard
AnalyticsCard
```

## 12. Frontend Data Rules

The frontend should not decide permissions by itself.

The frontend may hide UI based on role for convenience, but the backend must enforce permissions.

Example:

```txt
Frontend hides "Delete Exam" button from students.
Backend still rejects DELETE /exams/:id from students.
```

Frontend hiding is UX.

Backend checking is security.

Naturally, the part users cannot see is the part that actually matters. Humanity discovered this after inventing inspect element.

## 13. State Management

For v1, keep state simple.

Use:

- React server components where practical
- URL params for selected workspace/class/exam
- React state for local UI
- Form state through react-hook-form
- Server fetching or a lightweight query layer

Avoid adding global state libraries unless there is a real need.

## 14. Forms and Validation

Use:

- `react-hook-form`
- `zod`
- Shared validation schemas where practical

Example:

```ts
const createWorkspaceSchema = z.object({
  name: z.string().min(2),
});
```

Frontend validation improves UX.

Backend validation remains required.

Yes, validation twice. Computers are fast, users are creative.

## 15. Internationalization

Dwelve targets Uzbekistan first, so the frontend should be ready for multiple languages.

Recommended v1 languages:

```txt
English
Uzbek
Russian
```

Suggested file structure:

```txt
locales/
  en/
    common.json
  uz/
    common.json
  ru/
    common.json
```

Do not hardcode important UI text directly into components if translation is planned.

## 16. Build Commands

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production start:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## 17. Frontend Deployment

Recommended v1 frontend deployment:

```txt
Vercel
```

Why:

- Works well with Next.js
- Easy environment variables
- Simple preview deployments
- Handles static and server-rendered pages cleanly

Deployment checklist:

- [ ] Production API URL added
- [ ] App URL added
- [ ] Build passes
- [ ] Lint passes
- [ ] Auth redirects work
- [ ] Protected routes redirect guests to login
- [ ] Logged-in users cannot access login/register unnecessarily
- [ ] Workspace onboarding works
- [ ] API CORS accepts frontend domain
- [ ] Landing page metadata is set
- [ ] Favicon and app icon are set
- [ ] Error and loading states exist

## 18. Frontend Auth Behavior

Required behavior:

```txt
Guest visits /dashboard
→ redirect to /auth/login

Logged-in user visits /auth/login
→ redirect to /dashboard

Logged-in user without workspace
→ redirect to /onboarding

Logged-in user with workspace
→ show dashboard
```

## 19. Error Handling

Every data page should handle:

- Loading state
- Empty state
- API error state
- Unauthorized state
- Forbidden state
- Not found state

Example empty state:

```txt
No exams yet.
Create your first exam to start testing students online.
```

## 20. v1 Frontend Release Priorities

### Must-have

- Landing page
- Register/login
- Auth session handling
- Onboarding
- Workspace switcher
- Dashboard
- Classes UI
- Exams UI
- Question editor
- Student test-taking page
- Result page
- Basic analytics page
- Production deployment

### Should-have

- Invite flow
- Question bank UI
- Timer UI
- Manual grading UI
- Uzbek/Russian translations
- Email verification UI
- Account settings

### Later

- Full AI test generation UI
- PDF upload and conversion UI
- Advanced analytics
- Payment/billing UI
- Parent dashboard
- Mobile app

## 21. Frontend Definition of Done

Frontend v1 is ready when:

- Users can register and log in
- Users can create or join a workspace
- Dashboard changes based on role
- Teachers can create classes and exams
- Teachers can add questions
- Students can take exams
- Results are displayed correctly
- Basic analytics are visible
- App works against the production backend
- Protected routes work
- Production build passes
- The deployed app uses the production API URL
