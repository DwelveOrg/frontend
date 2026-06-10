# Dwelve — Design System

Status: draft · Last updated: 10 June 2026

This document is the human- and AI-readable explanation of Dwelve's visual design. The *source of truth* for actual values is the code (`tailwind.config.js`, `src/app/globals.css`, `src/app/layout.tsx`); this doc explains the intent and the rules so they stay consistent. Keep them in sync.

> **Multilingual rule (applies to everything below):** Dwelve ships in Uzbek (Latin), Russian, and English. Russian requires **Cyrillic** glyphs; Uzbek requires Latin-Extended plus the turned-comma character (U+02BB `ʻ`). Any font or component that can display user-generated text (names, answers, uploaded content) must support all three scripts. Test with real strings like `Ольга`, `Gʻulom`, and `O‘qituvchi` before shipping.

---

## 1. Typography

### Font roles

- **DM Serif Display** — editorial display only. Use for: the **Dwelve logo wordmark** and **Latin-script marketing/landing headings** (`h1`/`h2` on the landing page, marketing section titles). Regular weight (400) only.
- **DM Sans** — everything else. All UI text, labels, badges, table content, navigation, buttons, inputs, body copy — **and report-card student names**. Weights 400 (regular), 500 (medium), 600 (semibold).

### Script coverage — read before committing to these fonts

DM Sans and DM Serif Display are built on a **Latin / Latin-Extended** glyph set; Cyrillic is **not** part of their core coverage. This has two consequences:

1. **DM Serif Display must never hold text that can be Cyrillic.** That's why **report-card student names use DM Sans, not the serif** — a Russian name in a Latin-only serif renders as missing-glyph boxes. Keep the serif on controlled Latin text only (the logo, Latin marketing headings).
2. **Confirm DM Sans Cyrillic support on the live Google Fonts page.** `next/font/google` throws a build error if you request a subset the font doesn't ship, so this surfaces at build time — but verify deliberately rather than discovering it late.

**If DM Sans doesn't offer Cyrillic:** swap the body font for a near-identical sans with full Cyrillic — **Manrope**, **PT Sans**, or **Golos Text** are clean matches. If you ever need a Russian heading, **Playfair Display** is the usual DM-Serif-style display serif that includes Cyrillic.

### Implementation — `src/app/layout.tsx`

```ts
// src/app/layout.tsx
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const dmSans = DM_Sans({
  // 'cyrillic' included for Russian; remove only if the build confirms it's unsupported
  // (and then switch to a Cyrillic-capable sans — see "Script coverage" above)
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  // Latin only by design — never used for user text, so no Cyrillic needed
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
})

// Apply both variables on the root element, set DM Sans as the base:
// <html className={`${dmSans.variable} ${dmSerif.variable}`}>
//   <body className="font-sans"> ... </body>
// </html>
```

### Wire the fonts into Tailwind — `tailwind.config.js`

The `variable` option only defines a CSS variable. To use `font-sans` / `font-serif` utility classes you must map them, or Tailwind silently falls back to its default fonts.

```js
// tailwind.config.js (Tailwind v3)
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-serif)', ...defaultTheme.fontFamily.serif],
      },
    },
  },
}
```

> On Tailwind v4, do this in `globals.css` with `@theme inline { --font-sans: var(--font-sans); ... }` instead of the config file.

### Usage rules

**Do**
- Use `font-sans` (DM Sans) as the base on `<body>`.
- Use `font-serif` (DM Serif Display) only for: the logo wordmark, and Latin landing/marketing headings.
- Use DM Sans for report-card student names and all dashboard UI.

**Don't**
- Don't use DM Serif Display inside dashboard UI — tables, stat cards, sidebar items, badges, inputs.
- Don't use DM Serif Display for any text that can contain a Russian or Uzbek name or user-entered content.
- Don't use a straight apostrophe for Uzbek `oʻ`/`gʻ`; use U+02BB `ʻ`.

---

## 2. Coming next (placeholders)

These sections aren't written yet — add them as the design firms up:

- **Color** — palette, semantic tokens (success/warn/error for test results), light/dark, all defined as CSS variables in `globals.css`.
- **Spacing & layout** — scale, container widths, the dashboard grid.
- **Components** — buttons, inputs, badges, **results tables**, **progress charts**, modals (built on shadcn/ui — document variants and states).
- **Iconography** — icon set and sizing.
- **Accessibility** — color-contrast targets, focus states, minimum touch sizes.