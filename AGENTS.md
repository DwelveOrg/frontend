# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router frontend. Application routes live in `src/app`, with route groups such as `(landing)`, `(authentication)`, and `(root)` separating public, auth, and dashboard areas. Shared UI primitives are in `src/components/ui`, custom reusable components are in `src/components/Custom`, and layout-specific pieces sit beside their routes in `_components` folders. Common helpers are in `src/lib`, hooks in `src/hooks`, and translations in `src/i18n`. Static assets, including logos, belong in `public/images`.

## Build, Test, and Development Commands

- `npm run dev`: starts the local Next.js development server.
- `npm run build`: creates a production build and validates Next.js output.
- `npm run start`: serves the production build after `npm run build`.
- `npm run lint`: runs ESLint using `eslint.config.mjs`.

Use `npm install` to restore dependencies from `package-lock.json`.

## Branch Workflow

Always work on the `staging` branch for repository changes.

## Coding Style & Naming Conventions

Write TypeScript and React components with strict typing enabled. Prefer path aliases such as `@/components/ui/Button` over deep relative imports when crossing folders. Components and files that export components generally use PascalCase, for example `ThemeSwitch.tsx`; route files follow Next.js conventions such as `page.tsx` and `layout.tsx`. Keep route-local constants, types, utils, and components in underscored folders like `_types`, `_constants`, `_utils`, and `_components`. Use Tailwind classes for styling and `cn` from `src/lib/utils.ts` for conditional class composition. Run `npm run lint` before submitting changes.

## Testing Guidelines

No first-party test framework or `npm test` script is currently configured. When adding tests, colocate them near the code they cover with `*.test.ts` or `*.test.tsx`, and add a package script so contributors can run them consistently. Until then, validate changes with `npm run lint` and `npm run build`, and manually exercise the affected route in `npm run dev`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative messages such as `Update MainPage.tsx` and `Add missing imports in HowItWorks component`. Keep commits focused and describe the user-visible or technical change. Pull requests should include a concise summary, testing notes, linked issues when applicable, and screenshots or short recordings for UI changes. Mention affected routes, language resources, or auth/session behavior when relevant so reviewers know where to look.

## Security & Configuration Tips

Do not commit secrets or local environment files. Keep generated folders such as `.next` and `node_modules` out of version control. Review auth/session changes in `src/app/(authentication)/_lib` carefully because they affect login and protected routes.
