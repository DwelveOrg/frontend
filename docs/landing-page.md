# Dwelve Landing Page

Last updated: 18 June 2026

This file is a simple, AI-friendly description of what the Dwelve landing page currently contains. It is meant to stand in for "go look at the landing page" when you want another AI or collaborator to understand the page without opening the code.

## What The Landing Page Is

The Dwelve landing page is a public marketing page for an online school testing platform. It presents Dwelve as a simple tool for creating tests, sharing them with students, and getting results quickly.

The page is clean, modern, and product-focused. It uses a soft academic/SaaS visual style with:

- a sticky top navigation
- a hero section with headline and CTA buttons
- a features section
- a 3-step "how it works" section
- a FAQ accordion
- a final CTA section
- a footer

## Overall Message

The landing page currently communicates these core ideas:

- teachers can create tests online quickly
- students can take tests online without printing
- grading is instant
- results and insights are easy to access
- the product works on phones, tablets, and laptops
- question banks can be reused

In short, the current message is:

**"Dwelve helps schools run tests online with less paper, less manual grading, and faster results."**

## Page Structure

The landing page currently contains these sections in order:

1. Navbar
2. Hero section
3. Features section
4. How it works section
5. FAQ section
6. Final call-to-action section
7. Footer

## 1. Navbar

The top navigation contains:

- Dwelve logo on the left
- section links in the middle/right
- login and signup buttons on the right

Current actions in the navbar:

- `Login` goes to `/login`
- `Sign up` goes to `/signup`

Current section links scroll to:

- Features
- How it works
- FAQ

Important note:

The current translated labels are not perfectly aligned with the sections. For example, some labels say things like "Pricing" or "About" even though the actual destination is not a pricing page or full about page.

## 2. Hero Section

This is the main opening section of the landing page.

### What it contains

- a small trust badge
- a large main headline
- a short supporting description
- two CTA buttons
- a social-proof row
- a mock dashboard preview card on the right
- a "trusted by institutions" strip below

### Main message

The hero presents Dwelve as a fast way to create and take school tests online.

### Current English copy

Badge:

`Trusted by 500+ schools`

Headline:

`Create and take school tests online in minutes.`

Subtitle:

`No printing. Instant grading. Simple for teachers and students.`

Buttons:

- `Get started free`
- `Log in`

Social proof line:

`2,400+ educators and students`

Trusted-by label:

`Trusted by institutions worldwide`

### Visual content in the hero

The right side shows a fake dashboard preview with:

- a dashboard title
- a "Welcome back, Sarah" message
- 3 small stats
- a bar-chart style visual

The stat cards currently show:

- Courses: `6`
- Grade: `A-`
- Tasks: `4`

Below the hero, the page shows institution names as visual trust markers:

- Stanford
- MIT
- Harvard
- Oxford
- Yale

Important note:

These are currently presentation/mockup elements, not documented product data or verified customer references.

## 3. Features Section

This section introduces Dwelve's main product benefits in a grid of feature cards.

### Section message

It presents Dwelve as a modern, efficient classroom tool designed for speed and clarity.

### Current English section copy

Label:

`Core Features`

Title:

`Built for modern classrooms, designed for speed and clarity.`

Subtitle:

`Powerful tools designed for modern education, wrapped in a simple interface.`

### Current feature cards

1. Instant Grading
   Automatic scoring saves hours of manual checking.

2. Time-Controlled Exams
   Set exam durations and automatically close submissions when time runs out.

3. Performance Insights
   View average scores, top performers, and commonly missed questions.

4. Works on Any Device
   Students can take tests from phones, tablets, or laptops.

5. Reusable Question Bank
   Save questions and reuse them for future exams.

## 4. How It Works Section

This section explains the product in a simple 3-step flow.

### Current English section copy

Title:

`How it works`

Subtitle:

`Replace paper tests in three simple steps`

### Current steps

1. Create Your Test
   Build quizzes in minutes. Add questions and set a time limit.

2. Share with Students
   Send a test link or code. No printing needed.

3. Get Instant Results
   Automatic grading and real-time analytics.

### What this section communicates

This section reduces the product story to a very simple teacher workflow:

- create
- share
- review results

## 5. FAQ Section

This section answers basic questions that a teacher or student might have before using Dwelve.

### Current English section copy

Label:

`FAQ`

Title:

`Everything you need to know before you start`

Subtitle:

`Quick answers for teachers and students using Dwelve.`

### Current FAQ items

1. Do students need to install an app?
   No. Dwelve works directly in the browser on phones, tablets, and laptops.

2. Can I set a timer for tests?
   Yes. You can configure exam duration and submissions will close automatically when time is over.

3. How are results calculated?
   Objective questions are graded instantly and performance insights are shown right after submission.

4. Can I reuse my old questions?
   Yes. Save questions to your bank and reuse them for homework, quizzes, or exams.

## 6. Final CTA Section

This is the closing conversion section near the bottom of the page.

### What it contains

- a closing headline
- a short persuasive subtitle
- two CTA buttons

### Current English copy

Title:

`Start using Dwelve today`

Subtitle:

`Join thousands of educators transforming their classrooms. Free to get started — no credit card required.`

Buttons:

- `Sign up for free`
- `Learn more`

Important note:

The secondary button currently says `Learn more`, but at the moment it links to `/login`, not to a separate informational page.

## 7. Footer

The footer is simple and contains:

- Dwelve logo
- a row of text links
- copyright line

### Current footer links

- About
- Contact
- Support
- Privacy
- Terms

### Current footer behaviors

- Support opens an email link
- the other links are currently placeholders or minimal links

Important note:

The support email currently points to:

`support@gradeflow.app`

That looks like legacy branding and should be treated as current implementation detail, not intentional final Dwelve messaging unless confirmed.

## CTA Destinations

Current landing page buttons and links send users to:

- navbar login -> `/login`
- navbar signup -> `/signup`
- hero primary CTA -> `/signup`
- hero secondary CTA -> `/login`
- final CTA primary -> `/signup`
- final CTA secondary -> `/login`

Important signup behavior:

- `/signup` creates a normal platform user account only.
- Creating a school or learning center happens after signup/login and gives the creator an admin membership inside that organization.
- Teacher and student roles are not chosen during signup; they are granted through an invite or approved join code inside a specific school or learning center.

## Languages

The landing page has copy in:

- English
- Russian
- Uzbek Latin

All main landing page sections are translated.

## Visual Style

The current landing page feels like:

- a polished edtech SaaS homepage
- light, soft, slightly premium
- rounded cards and gentle shadows
- purple/indigo accents
- minimal but animated
- modern rather than playful

It includes:

- sticky blurred navbar
- soft gradient/radial background accents
- animated section entrances
- card-based feature layout
- product mockup instead of illustration-heavy marketing art

## What The Landing Page Does Not Clearly Explain Yet

Compared with the broader Dwelve product direction, the current landing page does not strongly explain some important parts of the product yet, including:

- PDF-to-test generation
- AI-assisted test drafting
- teacher review of AI-generated tests
- role-specific onboarding for admin / teacher / student
- private learning center positioning
- center management and class management depth
- detailed analytics story over time

So this landing page currently describes a simpler and more generic online testing product than the full Dwelve vision.

## Short AI Summary

If another AI needs a short description, use this:

**Dwelve's landing page is a public marketing homepage for an online school testing platform. It contains a sticky navbar, a hero section with headline and dashboard mockup, a 5-card features grid, a 3-step how-it-works section, a 4-question FAQ accordion, a final signup CTA, and a simple footer. The current messaging emphasizes online test creation, instant grading, device flexibility, reusable question banks, and fast results for teachers and students.**