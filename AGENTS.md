# Repository Guidelines

This file is for coding agents and contributors working in the Dwelve frontend repository.

For product requirements, read `docs/product-requirements.md`.
For the design system, read `docs/design-system.md`.
Do not duplicate full product or design documentation in this file; keep those documents in `docs/`.

---

## Project

Dwelve is a Next.js App Router frontend for a digital academic testing and performance-management platform for schools and private learning centers.

The frontend covers:

- public landing pages
- authentication pages
- authenticated dashboard pages
- test/exam workflows
- student/class management
- localization

---

## Build, test, and development commands

- `npm install` — restore dependencies from `package-lock.json`.
- `npm run dev` — start the local Next.js development server.
- `npm run build` — create a production build and validate Next.js output.
- `npm run start` — serve the production build after `npm run build`.
- `npm run lint` — run ESLint through `eslint.config.mjs`.

There is no first-party test framework or `npm test` script currently configured. Until that changes, validate with:

1. `npm run lint`
2. `npm run build`
3. manual testing in `npm run dev`

When adding tests, colocate them near the code they cover as `*.test.ts` or `*.test.tsx`, and add a package script.

---

## Branch workflow

Always work on the `staging` branch for repository changes unless the maintainer explicitly says otherwise.

---

## Project structure

This is a Next.js App Router frontend.

Application routes live in `src/app`, with route groups such as:

- `src/app/(landing)` — public marketing routes
- `src/app/(authentication)` — login, signup, password reset
- `src/app/(root)` — authenticated dashboard routes

Shared code:

- `src/components/ui` — shadcn/ui primitives
- `src/components/Custom` — custom reusable components
- `src/lib` — common helpers; `utils.ts` exports `cn`
- `src/hooks` — React hooks
- `src/i18n` — translations and i18next setup
- `public/images` — static images and logos

Route-local code should stay beside its route in underscored folders:

- `_components`
- `_constants`
- `_types`
- `_utils`
- `_lib`
- `_sections`
- `_types/_schemas`

---

## Coding style and naming

- Use TypeScript with strict typing.
- Prefer path aliases such as `@/components/ui/Button` over deep relative imports when crossing folders.
- Component files generally use PascalCase, for example `ThemeSwitch.tsx`.
- Next.js route files follow framework conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- Use Tailwind classes for styling.
- Use `cn` from `src/lib/utils.ts` for conditional class composition.
- Keep route-local constants, types, utilities, and components in route-local underscored folders.
- Run `npm run lint` before submitting changes.

---

## Internationalization

Dwelve supports:

- English
- Russian
- Uzbek Latin

Use translation keys instead of hard-coded UI copy. When adding new copy, update all supported language catalogs.

All user-facing components must render Uzbek Latin and Russian Cyrillic correctly. Follow `docs/design-system.md` for font and script rules.

---

## Design system usage

The design system lives in `docs/design-system.md`.

Do not copy token tables or font rules into this file. Agents should read the design document before making UI changes.

Key reminder only:

- use the approved sans font for app UI and user-generated text
- use the display serif only for controlled Latin-only marketing/logo text
- do not introduce competing fonts without updating the design system

---

## Commit and pull request guidelines

Recent commits use short imperative messages, for example:

- `Update MainPage.tsx`
- `Add missing imports in HowItWorks component`

Keep commits focused.

Pull requests should include:

- concise summary
- testing notes
- linked issue, if applicable
- screenshots or short recordings for UI changes
- affected routes
- affected language resources
- auth/session impact, if relevant

---

## Security and configuration

- Do not commit secrets.
- Do not commit local environment files.
- Keep generated folders such as `.next` and `node_modules` out of version control.
- Review auth/session changes carefully because they affect login and protected routes.