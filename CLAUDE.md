# CLAUDE.md

Guidance for Claude Code when working in this repository.

Read `AGENTS.md` first for general repository rules.
Read `docs/design-system.md` for design-system decisions.
Read `docs/product-requirements.md` for product scope and priorities.

This file is intentionally root-level because Claude Code uses root project guidance. Do not move it into `docs/`.

---

## Project

Dwelve, package name `gf-frontend`, is a Next.js App Router frontend for a digital academic testing and performance-management platform for schools and private learning centers.

Primary product areas:

- test creation
- test submission
- automated grading
- student/class analytics
- authentication
- trilingual UI

Stack noted in the existing project documentation:

**Dwelve** (package name `gf-frontend`) is a Next.js App Router frontend for a digital academic testing and performance-management platform for schools and learning centers — test creation, submission, automated grading, and analytics.

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui with Radix primitives
- i18next / react-i18next
- next-themes
- react-hook-form + zod
- jose for JWT sessions
- motion
- three

Verify package versions in `package.json` before making dependency-specific changes.

---

## Commands

- `npm install` — restore dependencies from `package-lock.json`
- `npm run dev` — local dev server
- `npm run build` — production build and output validation
- `npm run start` — serve production build
- `npm run lint` — ESLint through `eslint.config.mjs`

There is no configured `npm test` script in the uploaded guidance. Validate changes with `npm run lint`, `npm run build`, and manual route testing.

---

## Branch workflow

Use the `staging` branch for repository changes unless the maintainer explicitly says otherwise.

---

## Project structure

Routes live in `src/app`.

Known route groups:

- `src/app/(landing)` — public marketing site
- `src/app/(authentication)` — login, signup, password reset
- `src/app/(root)` — authenticated dashboard
- `src/app/(root)/(pages)` — dashboard pages
- `src/app/(root)/(pages)/(small-container)` — narrow-width pages such as profile, settings, notifications

Shared code:

- `src/components/ui` — shadcn/ui primitives
- `src/components/Custom` — custom reusable components
- `src/lib` — helpers; `utils.ts` exports `cn`
- `src/hooks` — hooks
- `src/i18n` — translations and i18next setup
- `public/images` — static assets

Route-local code goes in underscored folders such as `_components`, `_constants`, `_types`, `_utils`, `_lib`, `_sections`, and `_types/_schemas`.

---

## Coding conventions

- Type everything.
- Prefer `@/*` path aliases over deep relative imports when crossing folders.
- Use PascalCase for component files.
- Use Next.js route file names such as `page.tsx` and `layout.tsx`.
- Use client-component suffixes such as `page-client.tsx` or `profile.client.tsx` when the existing codebase follows that pattern.
- Use Tailwind classes and `cn` from `@/lib/utils`.
- Dark mode uses the class strategy through `next-themes`.
- Forms use `react-hook-form` and `zod` schemas, commonly under `_types/_schemas`.
- Icons use `lucide-react`.

---

## Auth and sessions

Existing guidance says:

- Session is a JWT in an httpOnly cookie named `session`.
- JWT signing/verification uses `jose` with HS256.
- Session code lives in `src/app/(authentication)/_lib/session.ts`.
- `SESSION_SECRET` should come from the environment.
- Login/logout server actions live in `src/app/(authentication)/_lib/actions.ts`.
- Server-side current user is read through `getUser()` in `src/app/(root)/_utils/getUser.ts`.
- Auth currently uses hard-coded `testUsers` in `src/app/(authentication)/_constants/index.ts`.
- No real backend is connected yet.
- `protectedRoutes` and `publicRoutes` exist there, but no `middleware.ts` exists in the uploaded guidance.

Treat auth/session changes as high-risk. Verify the current code before editing.

---

## Internationalization

Existing guidance says:

- i18n uses `i18next` and `react-i18next`.
- Supported languages are `en`, `ru`, and `uz`.
- Default language is `en`.
- Message catalogs live in `src/i18n/messages/{en,ru,uz}.ts`.
- UI copy should use dotted translation keys through `t(...)`, not literal strings.
- Selected language persists to `localStorage` under `gf-language`.
- `<html lang>` is kept in sync by app providers.

When adding UI copy, update all three catalogs.

---

## Design system

Do not treat `AGENTS.md` as the design-system source of truth.

Use:

- `docs/design-system.md` for design decisions
- `src/app/globals.css`, `src/app/layout.tsx`, and Tailwind theme setup for implementation values

The important correction from the old docs is that there should not be three competing font directions. Do not mix Inter, Geist, Montserrat, DM Sans, and DM Serif without updating the design system.

---

## Commits and PRs

Use short imperative commit messages and keep commits focused.

PR notes should include:

- what changed
- how it was tested
- affected routes
- screenshots or recordings for UI changes
- affected translations
- auth/session impact, if any

---

## Security and config

- Never commit secrets or local env files.
- Keep `.next` and `node_modules` out of version control.
- Set `SESSION_SECRET` in real environments.
- Review global providers carefully. Existing guidance says `src/app/providers.tsx` disables the right-click context menu globally; verify whether this behavior is intentional before preserving or expanding it.