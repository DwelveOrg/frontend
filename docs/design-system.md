# Dwelve — Design System

Status: draft · Last updated: 11 June 2026

This document is the design decision source of truth for Dwelve’s frontend. Implementation values must be kept in sync with `src/app/globals.css`, `src/app/layout.tsx`, and the Tailwind theme setup.

AGENTS.md and CLAUDE.md may summarize this file, but they must not duplicate the full design system.

---

## 1. Multilingual rule

Dwelve ships in:

- Uzbek Latin
- Russian
- English

Russian requires Cyrillic glyphs. Uzbek Latin requires Latin Extended glyphs and the turned-comma character U+02BB `ʻ`.

Any component that can display user-generated text — names, answers, uploaded content, class titles, comments — must support all three languages. Test real strings before shipping:

- `Ольга`
- `Gʻulom`
- `O‘qituvchi`
- `Student answer: Photosynthesis`

---

## 2. Typography

### Font roles

| Role | Font | Usage |
|---|---|---|
| Display / editorial | DM Serif Display | Dwelve logo wordmark and controlled Latin-only marketing headings |
| UI / body | DM Sans, if Cyrillic support is confirmed by build; otherwise Manrope, Golos Text, PT Sans, or Noto Sans | All UI text, body copy, labels, buttons, tables, inputs, student names, scores, dashboards, and user-generated content |

### Important rules

- Do not use DM Serif Display for text that may contain Russian, Uzbek names, user-generated content, dashboard UI, table data, cards, badges, or inputs.
- Do not use DM Serif Display for report-card student names.
- Student names and scores should use the UI/body sans font, not the serif font.
- Do not introduce Inter, Geist, or Montserrat as separate competing product fonts unless the design system is intentionally updated.
- Do not use straight apostrophes for Uzbek `oʻ` / `gʻ`; use U+02BB `ʻ` where the product copy requires it.

---

## 3. Font implementation

The project uses Tailwind CSS v4, so map Next font variables through `globals.css`.

### `src/app/layout.tsx`

```ts
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const sans = DM_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-dwelve-sans',
  display: 'swap',
})

const serif = DM_Serif_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-dwelve-serif',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}