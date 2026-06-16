# Product Requirements Document — Dwelve

| | |
|---|---|
| **Product** | Dwelve |
| **Tagline** | Exam and test automation for schools and private learning centers. |
| **Document status** | Draft v0.3 (concept stage) |
| **Last updated** | 11 June 2026 |
| **Author / owner** | Abdulaziz Yusupaliev |
| **Market** | Uzbekistan |
| **Primary initial segment** | Private learning centers |

---

## 1. Overview

Dwelve is a web platform for creating, delivering, grading, and analyzing tests, exams, and homework online. Students complete assessments in the browser. Teachers receive automatic results, progress dashboards, score history, and per-student analytics.

The core promise is **assessment automation and paper reduction**: replace printed tests, manual marking, and scattered paper records with one system that grades objective questions instantly and stores analyzable performance history.

Dwelve’s differentiators are:

- **PDF-to-test generation for teachers:** a teacher uploads an existing PDF test, and Dwelve converts it into an editable digital test.
- **Progress analytics:** teachers and admins can track student and class performance over time.
- **Student learning support:** after a test, students can review answers; AI per-question explanations are planned as a paid or usage-limited capability.

---

## 2. Problem statement

Schools and learning centers in Uzbekistan still run much assessment work on paper or fragmented tools. This creates recurring pains:

- **Cost and waste:** printing exams, homework, and quizzes for every student.
- **Teacher time lost to grading:** manual marking is slow and error-prone.
- **Delayed feedback:** students often see results too late to correct mistakes.
- **Weak historical tracking:** paper results are hard to aggregate into progress trends.
- **Fragmented workflows:** Google Forms, spreadsheets, chat apps, and paper records are not one structured assessment system.

Dwelve consolidates the workflow: build a test from a question bank or PDF, assign it, let students take it online, grade it, and show analytics.

---

## 3. Goals and objectives

### Product goals

- Let a teacher create and assign a graded online test in under 10 minutes.
- Let a teacher create a draft digital test from an existing PDF in seconds, then review and edit it before publishing.
- Auto-grade objective questions instantly.
- Support manual review for open-ended answers.
- Show per-student and per-class progress analytics.
- Reduce paper usage for centers that adopt Dwelve.

### Business goals

- Validate willingness to pay among private learning centers.
- Pilot with a small group of Tashkent learning centers.
- Convert early active centers from free to paid usage.
- Expand regionally after retention and pricing are validated.

---

## 4. Target users

| Role | Login | What they do in Dwelve | Primary need |
|---|---:|---|---|
| **Teacher / tutor** | Yes | Build tests, upload PDF tests, assign homework, view results, track progress | Save grading time and understand who is struggling |
| **Student** | Yes | Take tests, submit homework, review answers, ask for explanations when enabled | Clear tasks, feedback, and understanding |
| **School / center admin** | Yes | Manage teachers, classes, students, reports, and subscription | Oversight and value-for-money |
| **Parent** | No, out of scope for v1 | — | Deliberately excluded for now |

---

## 5. Market context and assumptions

Dwelve should start with **private learning centers**, not state schools.

Reasoning:

- State schools may already have official or subsidized digital education platforms.
- Private learning centers are more fragmented and more likely to buy tools directly.
- IELTS/SAT, language, IT, and exam-prep centers care strongly about measurable student outcomes.
- Smaller teams should avoid targeting state schools and private centers equally at the beginning.

> Market claims in this section should be treated as assumptions until they are backed by sources, interviews, or pilot data. Do not use this section as investor-facing evidence without validation.

---

## 6. Scope

### In scope for MVP

- Online test/exam builder.
- Question types: multiple choice, true/false, short answer.
- Reusable question banks.
- PDF-to-test generation with required teacher review before publishing.
- Online test-taking in the browser.
- Autosave during test sessions.
- Automatic grading for objective questions.
- Manual grading flow for open-ended answers.
- Post-test answer review for students.
- Basic teacher dashboard: results, score history, progress graphs, per-student detail.
- Class/student management.
- Basic admin oversight.
- Trilingual interface: Uzbek Latin, Russian, English.
- Basic exam integrity controls: time limits, question shuffling, answer autosave, one active attempt/session where possible.

### Post-MVP / Phase 2

- AI per-question explanations for students.
- Higher AI usage limits for paid plans.
- Advanced analytics.
- Advanced exam integrity tools, such as tab-switch logging, stronger session monitoring, randomized question banks, and suspicious activity reports.
- Local payment integration.
- More complete homework workflows.

### Out of scope for v1

- Parent accounts/portal.
- Native mobile apps.
- Kundalik/eMaktab/government-system integrations.
- Live video lessons.
- Fully automated publishing of AI-parsed tests without teacher review.

---

## 7. Core features and priority

| # | Feature | Priority | Phase | Notes |
|---:|---|---|---|---|
| 1 | Reusable question banks | P0 | MVP | Tag by subject, topic, difficulty; reuse across tests |
| 2 | Student progress analytics and graphs | P0 | MVP | Per-student and per-class trends over time |
| 3 | Auto-grading and instant results | P0 | MVP | Objective questions instant; open questions flagged for review |
| 4 | Online exam delivery | P0 | MVP | Timed sessions, shuffling, autosave |
| 5 | PDF-to-test generation | P0 | MVP | Teacher uploads PDF; AI creates an editable draft |
| 6 | Required teacher review for AI-generated tests | P0 | MVP | AI output must never auto-publish |
| 7 | Post-test answer review | P0 | MVP | Student sees correct answers after submission, based on teacher settings |
| 8 | Basic exam integrity controls | P0 | MVP | Time limits, shuffling, attempt/session rules |
| 9 | Roles and class management | P0 | MVP | Teacher / student / admin |
| 10 | Trilingual UI | P0 | MVP | Uzbek Latin, Russian, English |
| 11 | Homework assign/submit | P1 | Phase 2 | File types, deadlines, resubmission rules |
| 12 | Ask AI explanations | P1 | Phase 2 | Usage-limited on free plan; expanded in paid plan |
| 13 | Advanced exam integrity | P1 | Phase 2 | Tab-switch logging, randomized banks, suspicious activity report |
| 14 | Local payments and freemium gating | P1 | Phase 2 | Payme/Click, Uzcard/Humo; exact provider to validate |

---

## 8. What makes Dwelve different

- **Upload a PDF, get an editable test draft.** Teachers do not rebuild existing paper tests from scratch.
- **Structured assessment workflow.** Dwelve is built for question banks, attempts, grading, results, and history rather than generic forms.
- **Progress analytics over time.** Centers can measure improvement, not only one-off scores.
- **Local fit.** Uzbek Latin, Russian, and English UI from the start, with local payment support planned.
- **AI as a workflow accelerator.** AI speeds up test creation first, then supports student explanations after core assessment workflows are stable.

---

## 9. Key user flows

### Onboarding and access

Role is inherited from how a user enters, never chosen on a screen. The center grants a role through a credential, and the account is created already carrying it.

1. **Admin** signs up with a short form (center name, email, password), which creates the account and the center, then lands in an empty-but-usable dashboard. Logo, classes, and teacher invites are completed later as in-app onboarding.
2. **Teacher** receives a unique, single-use invite link from the admin. The link already knows the center; the teacher confirms their name, sets a password, and is immediately a teacher. Clicking the emailed link verifies their email.
3. **Student** joins with a reusable class code plus a name and is placed in that class as a student. Email is not required.
4. A freshly registered account that has joined nothing shows two redemption entry points: join a class with a class code, or become a teacher with an invite link. The credential, not the button, decides the role.
5. **Login** is one screen for every role — identifier and password, with no role picker. The account already knows the role and routes the user to the correct view, and selects the center when the account holds several memberships.

Notes: teacher access must use a targeted invite link or an email-bound one-time code rather than a shareable free-floating code, because the teacher role exposes answer keys. Invited users are verified by clicking the link; cold self-registration can be admitted immediately and verified lazily (required only at sensitive points such as password reset). Keying identity on email or phone lets one person hold memberships at several centers.

### Manual test creation → result

1. Teacher creates a test from the question bank or new questions.
2. Teacher sets rules: time limit, shuffle, attempts, review visibility.
3. Teacher assigns the test to a class.
4. Students take the test in-browser.
5. Answers autosave.
6. Objective questions grade instantly.
7. Open-ended answers enter a teacher review queue.
8. Results publish based on teacher settings.
9. Dashboard updates class and student analytics.

### PDF-to-test generation

1. Teacher uploads a PDF of an existing test.
2. AI parses questions, answer options, and answer keys where possible.
3. Dwelve creates an editable draft test.
4. Teacher reviews, edits, and confirms the generated content.
5. Teacher publishes the test.
6. The test behaves like any other Dwelve assessment.

### Student review

1. Student submits the test.
2. Student sees score and correct answers if the teacher allows review.
3. Student can view explanations when the feature is enabled and usage limits allow it.

---

## 10. Monetization

Freemium. The free tier should make adoption easy; the paid tier should unlock scale, analytics, AI usage, and operational controls.

### Free tier

- Core test creation with limits.
- Limited student count, class count, or question-bank size.
- Basic results.
- Post-test answer review.
- Limited PDF-to-test usage, if AI cost allows.

### Paid tier

- Larger/shared question banks.
- Advanced analytics.
- Higher PDF-to-test limits.
- Ask AI explanations.
- Advanced exam integrity controls.
- Admin reporting.
- Local payment support.

### Billing assumptions to validate

- Per center per month.
- Per active student per month.
- Hybrid: base center subscription plus usage limits.

---

## 11. Non-functional requirements

- **Localization:** full Uzbek Latin, Russian, English. Uzbek Cyrillic can be evaluated later.
- **Script support:** UI fonts and user-generated-content components must render Uzbek Latin, Russian Cyrillic, and English correctly.
- **Performance:** must support a full class taking an exam simultaneously.
- **Reliability:** autosave must protect students from brief disconnects.
- **Integrity:** attempts, submissions, grades, and result history must be tamper-resistant.
- **Accessibility:** usable on low-to-mid-range devices and average local bandwidth.
- **Security:** no secrets in frontend code; auth/session logic must be reviewed carefully.

### AI-specific requirements

- PDF-to-test output must always require teacher review before publishing.
- AI parsing quality must be tested with Uzbek, Russian, English, mixed scripts, math, tables, and scanned/low-quality PDFs.
- AI explanation quality must be tested especially in Uzbek.
- Free-tier AI usage must have clear limits because AI calls have real cost.

---

## 12. Success metrics

- Centers onboarded.
- Free-to-paid conversion rate.
- Weekly active teachers.
- Tests created per teacher.
- Share of tests created through PDF upload.
- Tests delivered online.
- Estimated paper displaced.
- Average grading time saved.
- Student review usage.
- Ask AI usage after Phase 2 launch.
- Retention after 1 and 3 months.

---

## 13. Risks and open questions

### Highest risks

- **Focus risk:** targeting state schools and private centers equally would split effort. Start with private centers.
- **AI parsing risk:** PDF parsing may fail on math, images, scans, or mixed scripts.
- **Language quality risk:** Uzbek AI output and font/script handling must be proven, not assumed.
- **Exam trust risk:** online exam results need basic integrity controls from the MVP.
- **Pricing risk:** the best unit — per center, per active student, or hybrid — is not validated.

### Open questions

- Which center segment should be piloted first: IELTS/SAT, language, IT, or general tutoring?
- Which subjects/exams should be seeded first?
- What is the right free AI limit?
- Should Uzbek Cyrillic be supported at launch or after validation?
- Which local payment provider should be integrated first?
- What minimum integrity controls are enough for early pilots?

---

## 14. Suggested roadmap

### Phase 1 — MVP / pilot

- Question bank.
- Test builder.
- PDF-to-test generation.
- Required teacher review for generated tests.
- Online test delivery.
- Autosave.
- Auto-grading for objective questions.
- Manual grading queue.
- Post-test answer review.
- Basic analytics.
- Basic exam integrity.
- Trilingual UI.
- Pilot with 3–5 Tashkent learning centers.

### Phase 2 — paid tier and retention

- Ask AI explanations.
- Premium AI usage limits.
- Advanced exam integrity.
- Local payments.
- Richer analytics.
- Homework workflows.
- Admin reporting.

### Phase 3 — expansion

- Regional expansion.
- Deeper reporting.
- Additional integrations.
- Evaluate state-school strategy.
- Evaluate parent visibility.

---

## 15. Notes

The earlier “market rating” section is useful as internal business thinking, but it is not a core PRD requirement. Keep it in a separate research/business note if needed, not in the main PRD.