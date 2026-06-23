# Dwelve — Design System

Status: draft · Last updated: 17 June 2026

This document is the design decision source of truth for Dwelve's frontend. Implementation values must be kept in sync with `src/app/globals.css`, `src/app/layout.tsx`, and the Tailwind theme setup.

AGENTS.md and CLAUDE.md may summarize this file, but they must not duplicate the full design system.



> **Logo color correction — 17 June 2026:** The logo assets in this package use the uploaded reference image as the master mask. The logo shape was not redrawn. Only RGB colors were mapped to the sampled reference palette: Ink `#0F1537`, Purple Accent `#7B58E8`, Purple Deep `#6A5DE9`, Light Background `#F3F4FF`, Dark Background `#14152A`, and White `#FFFFFF`.

> **Changelog — 17 June 2026:** Added the canonical **Color system** (§4), **Logo color usage** (§5), and **Implementation mapping** (§6). These colors are derived from the approved Dwelve logo so that the logo, marketing, and product UI all share one palette. Before this revision the design system defined only typography and language rules, which left website color undefined and free to drift from the logo.

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
| Display / editorial | DM Serif Display | Controlled Latin-only marketing headings |
| UI / body | DM Sans, if Cyrillic support is confirmed by build; otherwise Manrope, Golos Text, PT Sans, or Noto Sans | All UI text, body copy, labels, buttons, tables, inputs, student names, scores, dashboards, and user-generated content |

### Important rules

- Do not use DM Serif Display for text that may contain Russian, Uzbek names, user-generated content, dashboard UI, table data, cards, badges, or inputs.
- Do not use DM Serif Display for report-card student names.
- Student names and scores should use the UI/body sans font, not the serif font.
- Do not introduce Inter, Geist, or Montserrat as separate competing product fonts unless the design system is intentionally updated.
- Do not use straight apostrophes for Uzbek `oʻ` / `gʻ`; use U+02BB `ʻ` where the product copy requires it.

### Logo wordmark decision

The current mortarboard-and-open-book lockup is the canonical Dwelve mark. Its wordmark uses a **bold geometric sans** style, matching the product's modern ed-tech tone and the uploaded logo reference. The logo should therefore stay sans, not serif.

- Keep the delivered SVG/logo artwork as the authority for the mark.
- Do not re-cut the logo wordmark in DM Serif Display.
- DM Serif Display remains allowed only for controlled Latin-only marketing headings, not for the logo, dashboard UI, forms, tables, names, scores, or user-generated content.
- For live website text that visually supports the logo, prefer the UI sans family at 700–800 weight instead of introducing a separate competing brand font.

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
```

---

## 4. Color system

This palette is the single source of truth for color across the logo, marketing site, and product UI. It is derived from the approved Dwelve logo: deep indigo "Ink" for structure and text, a vibrant violet accent for emphasis and action, and a soft lavender "Mist" for quiet surfaces. **Do not introduce ad-hoc colors in components or `globals.css` that are not in this section.**

### 4.1 Core brand

| Token | Hex | Role |
|---|---|---|
| Ink (Primary Dark) | `#0F1537` | Logo cap & left page on light, primary text, dark surfaces |
| Violet (Brand Accent) | `#7B58E8` | Logo book page, brand accent, focus ring, highlights, large accent type |
| Violet Deep (Action) | `#6A5DE9` | Primary buttons & links (AA-safe with white text) |
| Mist (Light BG) | `#F3F4FF` | Soft section backgrounds, secondary surfaces, selected/hover tints |
| White | `#FFFFFF` | Page background, surfaces, text on dark |
| Black | `#000000` | Reserved for one-color print only; prefer Ink in product UI |

### 4.2 Violet scale (accent ramp)

`#7B58E8` is the brand anchor at **500**. Use the ramp for states, tints, charts, and elevation.

| 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|
| `#F4F1FF` | `#E9E3FF` | `#D3C7FF` | `#B7A3FF` | `#9B80FF` | `#7B58E8` | `#6A5DE9` | `#5739D6` | `#4B36C9` | `#2E246E` |

### 4.3 Neutral / Ink scale (cool grey, tuned to the navy)

| 0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#FFFFFF` | `#F7F8FC` | `#F1F2F9` | `#E6E8F2` | `#D4D7E6` | `#A9AEC6` | `#797F9C` | `#565C7A` | `#3B4160` | `#242949` | `#0F1537` |

Primary text = 900 (`#0F1537`). Muted text = 600 (`#565C7A`). Borders/dividers = 200 (`#E6E8F2`).

### 4.4 Semantic

Because Dwelve grades tests, the green/red pair carries meaning (correct / incorrect, pass / fail). Keep these consistent everywhere results are shown.

| Token | Hex | Soft surface | Meaning |
|---|---|---|---|
| Success | `#16B981` | `#E7F8F1` | Correct answer, passed, positive trend |
| Warning | `#F59E0B` | `#FEF3E2` | Caution, due soon, needs review |
| Danger | `#E5484D` | `#FCEBEB` | Incorrect answer, failed, destructive action |
| Info | `#4F86FF` | `#E9F0FF` | Neutral information, tips, integrity notices |

### 4.5 Brand gradient

`linear-gradient(135deg, #7B58E8 0%, #6A5DE9 100%)`

This is the gradient on the logo's book page. Reuse it sparingly for hero accents, primary CTAs on marketing pages, and progress emphasis. Do not place small body text on it (use white text only at large sizes).

### 4.6 Accessibility rules

- **`#6A5DE9` (Violet Deep)** on white ≈ 4.6:1 → AA for normal text. Use it for buttons, text links, and any small interactive label that needs white text.
- **`#7B58E8` (Violet 500)** on white ≈ 3.7:1 → **not** for small body text. Use it for large headings (≥24px/bold ≥19px), icons, borders, focus rings, and filled chips.
- **Ink `#0F1537`** on white ≈ 17:1 (AAA) and white on Ink ≈ 17:1 (AAA).
- Never signal correct/incorrect by color alone; pair Success/Danger with an icon or label for color-blind users and for screenshots in reports.

---

## 5. Logo color usage

The logo ships as outlined SVG and PNG exports in `public/dwelve_web_logo_assets/`. The canonical asset inventory, served URLs, and file-purpose mapping live in [brand-assets.md](./brand-assets.md). Color variants map to this palette exactly:

| Surface | Cap & left page | Book (right page) | Wordmark |
|---|---|---|---|
| Light backgrounds | Ink `#0F1537` | Violet gradient `#7B58E8 → #6A5DE9` | Ink `#0F1537` |
| Dark backgrounds | White `#FFFFFF` | Violet gradient `#7B58E8 → #6A5DE9` | White `#FFFFFF` |
| One-color (print) | Ink **or** White (whole mark, flat) | same as mark | same as mark |

- Minimum clear space around the mark = the height of the cap.
- Do not recolor the wordmark independently of the icon, recolor the book page to anything outside the violet ramp, or place the light-mode logo on backgrounds darker than Neutral 200.
- For app icons / favicons use the icon-only mark on Mist `#F3F4FF` or white, with Ink `#0F1537` and the violet gradient preserved. Do not use unrelated blue, teal, orange, or generic SaaS gradients for logo containers.
- Use `/dwelve_web_logo_assets/logos/dwelve-logo-horizontal.svg` as the default light-surface website logo and `/dwelve_web_logo_assets/logos/dwelve-logo-horizontal-dark.svg` on dark surfaces.
- Use `/dwelve_web_logo_assets/logos/dwelve-logo-icon.svg` only where the full wordmark would be too small or redundant, such as app icons, compact navigation, or favicons.

### 5.1 Website style direction

The website should feel like the logo: structured, academic, modern, and slightly premium. Use Ink for authority, Mist for calm learning surfaces, and Violet only as the active/emphasis color. The product should not drift into random bright blues or generic rainbow gradients.

Light mode:

- Page background: White `#FFFFFF`.
- Large soft sections: Mist `#F3F4FF` or Neutral 50 `#F7F8FC`.
- Primary text: Ink `#0F1537`.
- Muted text: Neutral 600 `#565C7A`.
- Primary actions: Violet Deep `#6A5DE9`.
- Decorative accents: Violet 500 `#7B58E8` or brand gradient only.

Dark mode:

- Page background: `#14152A`.
- Cards and elevated panels: `#131A3A`.
- Primary text: `#ECEEF9` or White.
- Muted text: `#9AA0BE`.
- Primary actions and focus states: Violet Light `#7B58E8`.
- Keep the logo wordmark white on dark backgrounds and preserve the violet book-page gradient.

Marketing visuals:

- Use education/product imagery with clean cards, progress charts, question sheets, and dashboard previews.
- Use the brand gradient sparingly for hero glows, CTA surfaces, active progress, and logo book-page continuity.
- Avoid saturated non-brand blues as primary accents; the only blue in the system should be semantic Info `#4F86FF`.
- Do not place small text directly on the violet gradient; use Ink/White backgrounds for readable copy.


---

## 6. Implementation mapping

Color is implemented as CSS variables in `src/app/globals.css` and exposed to Tailwind v4 via `@theme inline`. The shipped `globals.css` is the canonical implementation of this section; the table below is the contract.

| shadcn / Tailwind token | Light | Dark |
|---|---|---|
| `--background` | `#FFFFFF` | `#14152A` |
| `--foreground` | `#0F1537` | `#ECEEF9` |
| `--card` | `#FFFFFF` | `#131A3A` |
| `--card-foreground` | `#0F1537` | `#ECEEF9` |
| `--primary` | `#6A5DE9` | `#7B58E8` |
| `--primary-foreground` | `#FFFFFF` | `#14152A` |
| `--secondary` | `#F3F4FF` | `#1B2245` |
| `--secondary-foreground` | `#2E246E` | `#ECEEF9` |
| `--muted` | `#F1F2F9` | `#1B2245` |
| `--muted-foreground` | `#565C7A` | `#9AA0BE` |
| `--accent` | `#EFEBFF` | `#25204A` |
| `--accent-foreground` | `#4B36C9` | `#D7CEFF` |
| `--destructive` | `#E5484D` | `#FF6B6F` |
| `--border` / `--input` | `#E6E8F2` | `#262C4E` |
| `--ring` | `#7B58E8` | `#7B58E8` |
| `--radius` | `0.75rem` | `0.75rem` |

Brand-named tokens (`--brand-ink`, `--brand-violet`, `--brand-violet-600`, `--brand-mist`, `--brand-gradient`) are also exported so logo-accurate colors can be used directly, e.g. `bg-brand-violet`, `text-brand-ink`, `bg-[image:var(--brand-gradient)]`.

Dark mode uses the `.dark` class strategy through `next-themes`, consistent with CLAUDE.md.

---

## 7. Application shell & navigation

> **Changelog — 23 June 2026:** The authenticated dashboard shell (`src/app/(root)`) was rebuilt from the floating-card layout to a **flat-panel layout** to match the approved reference (`public/images/image 7.svg`). Only structure, spacing, and component states changed — **all colors continue to come from the tokens in §4 / §6; no new colors were introduced.** This section is the contract for the shell; the implementation lives in `src/app/(root)/_components/`.

### 7.1 Shell structure

The shell is two columns with no outer canvas padding — panels meet at hairline dividers instead of floating on a tinted background.

| Region | Surface token | Separator |
|---|---|---|
| Canvas (page background behind content) | `--muted` (light) / `--background` (dark) | — |
| Sidebar (flush-left, full height) | `--sidebar` (cool off-white, one layer off the white content surface) | `border-r` = `--border` |
| Top bar (flush-top of content column) | `--card` | `border-b` = `--border` |
| Content | transparent (shows the canvas) | — |

- Layout: `src/app/(root)/layout.tsx`. A flex row of `<SideBar>` + a content column (`<Navbar>` over a scrolling `<main>`).
- Content is centred in a `max-w-[1180px]` column with `px-4 py-6 md:px-8 md:py-8`.
- On mobile (`< md`) the sidebar collapses to a fixed bottom navigation bar; the content column is full-width and reserves `pb-24` for it.

### 7.2 Sidebar (`_components/Sidebar`)

- Fixed width `264px`. No collapse/expand control — the sidebar is always expanded.
- **Brand:** `<DwelveLogo variant="form" />` at the top (`px-6 pt-6 pb-5`, so the logo's left edge lines up with the nav-row icon column). No tagline/subtitle.
- **Primary nav** (single flat list, in order): Dashboard, Classes, School, Assignments, Notifications, Settings.
- **Bottom group** (separated by `border-t`): Profile, Log out. Log out is neutral at rest (icon inherits `--muted-foreground`) and turns `--destructive` — icon, text, and a soft background tint — on hover only.
- **Row geometry:** `rounded-xl px-3 py-2.5`, 20px icon, `gap-3`, `text-[15px]`.

Nav row states:

| State | Background | Text / icon | Weight |
|---|---|---|---|
| Active | `color-mix(--primary 14%, transparent)` — soft brand tint | `--accent-foreground` | `font-semibold` (600) + `tracking-[0.01em]` |
| Idle | transparent | `--muted-foreground` | `font-normal` (400) |
| Hover (idle) | `--muted` | `--foreground` | `font-normal` (400) — color shift only |
| Locked ("Soon") | transparent, `opacity-55`, not interactive | `--muted-foreground` | `font-normal` (400) |

**Weight is the primary state signal, not size.** Idle rests at `font-normal` (400) so the active jump to `font-semibold` (600) reads as a clear "you are here"; a heavier idle would leave the active state nowhere to go. Hover shifts colour only (no weight bump), so idle rows never carry two competing signals and never reflow. Row size is constant (`text-[15px]`) across all states — state is never signalled by size, which would shift the layout.

- **Count badge** (Notifications row): a pill using `--destructive` / `--destructive-foreground`, right-aligned (`ml-auto`). Driven by the live unread count from `notificationItems`.
- The locked **Assignments** item carries a `--muted` "Soon" pill and is non-interactive (teacher-gated feature, not yet shipped).

The active treatment is a **soft brand tint** (`color-mix(in srgb, var(--primary) 14%, transparent)` background + `--accent-foreground` text), not a solid fill. It is mixed from `--primary` rather than the near-white `--accent` so it stays legible on the `--sidebar` surface in both themes. All interactive rows share one `focus-visible` ring (`--ring`, offset against `--sidebar`).

### 7.3 Top bar (`_components/Navbar`)

- Flat bar, `--card` surface, `border-b` hairline, `px-4 py-3 md:px-6 md:py-3.5`. No large page title.
- **Left:** breadcrumb only, always led by **Home** (→ `/dashboard`) followed by the active route trail, e.g. `Home / Notifications`. The trailing crumb is the current page (`--foreground`, semibold); ancestors are `--muted-foreground` links. Key: `root.breadcrumb.home`.
- **Right:** a notification icon button (square, `rounded-xl`, `--border`), showing a `--destructive` dot when there are unread items, and a circular **avatar menu**.
- **Avatar menu** (`_components/Navbar/_components/Profile`): a `--accent` circle showing the user's initial (or a fallback icon) that opens a dropdown with Profile, Settings, and Log out.

### 7.4 Content page header (`_components/PageHeader` + `_components/RouteHeader`)

Because the top bar no longer carries the title, every view names itself in the content area:

- `PageHeader` — reusable presentational header: `title` (≈28px bold), optional `subtitle` (`--muted-foreground`), optional right-aligned `actions`.
- `RouteHeader` — derives the title from the current route and renders `PageHeader`; mounted once in the shell layout so all pages get a consistent heading. Pages needing a subtitle or action buttons should compose `PageHeader` directly.
