# CLAUDE.md

Guidance for Claude Code when working in this repository. See `AGENTS.md` for the full design-system spec; this file is the working summary plus codebase-specific notes verified against the source.

## Project

**Dwelve** (package name `gf-frontend`) is a Next.js App Router frontend for a digital academic testing and performance-management platform for schools and learning centers — test creation, submission, automated grading, and analytics.

Stack: **Next.js 16** (App Router, RSC) · **React 19** · **TypeScript** (strict) · **Tailwind CSS v4** · **shadcn/ui** (`radix-nova` style, Radix primitives) · **i18next** · **next-themes** · **react-hook-form + zod** · **jose** (JWT sessions) · **motion** · **three**.

## Commands

- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — production build; also validates output (run before submitting)
- `npm run start` — serve the production build
- `npm run lint` — ESLint via `eslint.config.mjs` (run before submitting)
- `npm install` — restore deps from `package-lock.json`

There is **no test framework or `npm test`** configured. Validate changes with `npm run lint`, `npm run build`, and by manually exercising the affected route in `npm run dev`. If you add tests, colocate as `*.test.ts(x)` and add a package script.

## Branch Workflow

Always work on the **`staging`** branch for repository changes.

## Project Structure

Next.js App Router. Routes live in `src/app`, organized by **route groups**:

- `src/app/(landing)` — public marketing site. Sections in `_sections/`, cards in `_components/cards/`.
- `src/app/(authentication)` — login / signup / password-reset. Pages under `(pages)/`.
- `src/app/(root)` — authenticated dashboard. Pages under `(pages)/`, with a nested `(small-container)` group for narrow-width pages (profile, settings, notifications).

Shared code:

- `src/components/ui` — shadcn/ui primitives (Button, Input, select, dropdown-menu, accordion, etc.)
- `src/components/Custom` — custom reusable components
- `src/lib` — helpers (`utils.ts` exports `cn`, `localStorage.ts`)
- `src/hooks` — hooks (e.g. `useMobile.ts`)
- `src/i18n` — translations and i18next setup
- `public/images` — static assets (logos)

Route-local code goes in **underscored folders** beside the route: `_components`, `_constants`, `_types`, `_utils`, `_lib`, `_sections`, and `_types/_schemas`.

## Coding Conventions

- **TypeScript strict** mode. Type everything.
- **Path alias `@/*`** maps to `./src/*` (and repo root). Prefer `@/components/ui/Button` over deep relative imports across folders.
- **Naming:** component files are PascalCase (`ThemeSwitch.tsx`); Next.js files follow convention (`page.tsx`, `layout.tsx`). Client-component splits use suffixes like `page-client.tsx` / `profile.client.tsx`.
- **Styling:** Tailwind classes; compose conditionally with `cn` from `@/lib/utils`. Dark mode via the `class` strategy (`next-themes`).
- **Forms:** `react-hook-form` + `zod` schemas (in `_types/_schemas`) wired with `@hookform/resolvers`.
- **Toasts:** `react-toastify` (`<Toaster />` mounted in the root layout).
- **Icons:** `lucide-react`.

## Auth & Sessions

- Session is a JWT in an httpOnly cookie named `session`, signed/verified with **jose** (HS256). Code in `src/app/(authentication)/_lib/session.ts`. Secret comes from `process.env.SESSION_SECRET` (falls back to a default — set this in real environments).
- Server actions for login/logout are in `src/app/(authentication)/_lib/actions.ts` (`"use server"`).
- Server-side current user: `getUser()` in `src/app/(root)/_utils/getUser.ts`. The `(root)` layout is `force-dynamic` and reads the user there.
- Auth currently uses **hard-coded `testUsers`** in `src/app/(authentication)/_constants/index.ts` (roles: `student`, `teacher`) — there is no real backend yet. `protectedRoutes` / `publicRoutes` are also defined there, but no `middleware.ts` exists.
- **Review auth/session changes carefully** — they gate login and protected routes.

## Internationalization

- `i18next` + `react-i18next`, initialized **client-side** in `src/i18n/index.ts`.
- Supported languages: `en`, `ru`, `uz` (default `en`), defined in `src/i18n/resources.ts`. Message catalogs live in `src/i18n/messages/{en,ru,uz}.ts`.
- UI strings are **dotted translation keys** (e.g. `root.notifications.items.newMessage.title`) resolved via `t(...)`, not literal text. Add new copy to all three catalogs.
- Selected language persists to `localStorage` under `gf-language` (handled in `src/app/providers.tsx`); `<html lang>` is kept in sync.

## Design System

Source of truth is `AGENTS.md`. Key tokens:

- **Primary:** Indigo `#4F46E5`
- **Background:** `#f4f5f7` (app pages), `#ffffff` (landing/auth)
- **Cards:** white, `border-radius: 12px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.04)`
- **Inputs:** `border-radius: 8px`, `1px solid #e8e8ec`, `height: 42px`
- **Text:** `#1a1a2e` headings, `#64748b` body, `#94a3b8` muted
- **Sidebar:** 240px fixed, white, indigo active `#f0f0ff`
- **Status:** green `#22c55e`, amber `#f59e0b`, red `#ef4444`

**Typography note:** `AGENTS.md` specifies **DM Serif Display** (headings only) + **DM Sans** (everything else) as the intended system. The current `src/app/layout.tsx` actually loads **Geist** (`--font-sans`), **Montserrat**, and **Inter** instead. When touching fonts, confirm the intended direction rather than assuming the doc and code agree.

## Commits & PRs

- Short, imperative commit messages describing the user-visible or technical change (e.g. `Update MainPage.tsx`). Keep commits focused.
- PRs: concise summary, testing notes, linked issues when applicable, and screenshots/recordings for UI changes. Call out affected routes, language resources, or auth/session behavior so reviewers know where to look.

## Security & Config

- Never commit secrets or local env files. Set `SESSION_SECRET` via environment, not in code.
- Keep `.next` and `node_modules` out of version control.
- `src/app/providers.tsx` globally disables the right-click context menu.
