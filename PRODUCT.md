# Product

## Register

product

## Users

Schools and private learning centers in Uzbekistan and the wider CIS region — administrators, teachers, and students. Admins set up an organization and its classes; teachers author tests and review results; students take tests and track their performance. Users are in a task-focused workflow (creating, grading, or reviewing academic work), often on modest hardware and in one of three languages (English, Russian, Uzbek Latin).

## Product Purpose

Dwelve (`gf-frontend`) is a digital academic testing and performance-management platform: test creation, submission, automated grading, and student/class analytics. Success is teachers spending less time grading and more time teaching, and administrators getting trustworthy performance data. The interface should disappear into the task.

## Brand Personality

Structured, academic, modern, quietly premium. Derived from the Dwelve logo: deep indigo "Ink" for authority, a violet accent for emphasis and action, calm lavender/neutral surfaces for focus. Confident and legible, never flashy.

## Anti-references

- Generic SaaS "bright blue + rainbow gradient" dashboards. The product must never drift into random bright blues; the only blue in the system is semantic Info. The brand accent is violet (`--primary` `#6A5DE9` / `#7B58E8`).
- Floating-card, heavy-shadow, glassmorphism layouts. The authenticated shell is deliberately flat: hairline borders, token surfaces, panels that meet at dividers rather than float.
- Ad-hoc hex colors in components. All color comes from the tokens in `globals.css` / design-system §4–§6.

## Design Principles

- **One palette, everywhere.** Logo, marketing, and product UI share the token system. No component invents its own hex.
- **Flat over floating.** Structure comes from hairline borders and surface tokens (`--card`, `--muted`, `--sidebar`), not big shadows or gradients.
- **Accent means action.** Violet `--primary` marks primary actions, current selection, and state — not decoration.
- **Consistency over surprise.** The same button, card, and row vocabulary screen to screen. Delight is reserved for moments (empty-state artwork, subtle motion), not every surface.
- **Trilingual by default.** Every text surface must hold English, Russian, and Uzbek Latin (including U+02BB `ʻ`).

## Accessibility & Inclusion

WCAG AA for text contrast. Body text ≥ 4.5:1, large/bold text ≥ 3:1. Never signal correct/incorrect by color alone — pair success/danger with an icon or label. Respect `prefers-reduced-motion`. Dark mode is a first-class theme via the `.dark` class strategy.
