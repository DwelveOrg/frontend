# Product Requirements Document — Dwelve

| | |
|---|---|
| **Product** | Dwelve |
| **Tagline** | An online platform for managing students and running tests & exams — exam and test automation for schools and learning centers. |
| **Document status** | Draft v0.2 (concept stage) |
| **Date** | 10 June 2026 |
| **Author** | Abdulaziz Yusupaliev |
| **Market** | Uzbekistan |

---

## 1. Overview

Dwelve is a web platform that lets schools and private learning centers create, deliver, and grade tests, exams, and homework fully online. Students complete assessments directly in the browser; teachers get automatic results plus dashboards showing each student's progress, score history, and performance graphs. It works like Google Classroom for assignments, but with deeper assessment and analytics, and more flexibility for the teacher.

The core promise is **automation and paper reduction**: replace printed tests, manual marking, and scattered paper records with one system that grades instantly and keeps a permanent, analyzable record of every student's performance.

Dwelve also uses AI in two ways that set it apart:

- **For students:** after a test, a student can ask the AI to explain any specific question in clear language.
- **For teachers:** a teacher can upload a PDF of an existing test, and the AI turns it into a ready-to-use digital test inside Dwelve.

---

## 2. Problem statement

Schools and learning centers in Uzbekistan still run most assessment on paper. This creates four recurring pains:

- **Cost and waste** — printing exams, homework, and quizzes for every student, every cycle.
- **Teacher time lost to grading** — manual marking is slow and error-prone, delaying feedback to students.
- **No usable history** — paper results are hard to aggregate, so teachers and centers can't see trends in a student's progress or compare groups.
- **Fragmented tools** — those who go digital stitch together Google Forms, spreadsheets, and chat apps that were never built for structured assessment.

Dwelve consolidates this into a single automated workflow: build a test from a question bank, assign it, let students take it online, and get graded results plus analytics with no manual marking.

---

## 3. Goals and objectives

**Product goals**
- Let a teacher create and assign a graded online test in under 10 minutes — or in seconds by uploading an existing PDF test.
- Auto-grade objective questions instantly and surface clear per-student and per-class analytics.
- Cut a center's assessment-related paper use substantially within the first term of use.

**Business goals**
- Validate willingness to pay among private learning centers via the freemium model.
- Reach a first cohort of paying centers in Tashkent, then expand regionally.

---

## 4. Target users

| Role | Login | What they do in Dwelve | Primary need |
|---|---|---|---|
| **Teacher / tutor** | Yes | Build tests (manually or from PDF), assign HW, view results, graphs, per-student progress | Save grading time; see who's struggling |
| **Student** | Yes | Take tests/exams online, submit homework, review answers, ask AI to explain questions | Clear tasks, instant feedback, understanding |
| **School / center admin** | Yes | Manage teachers, classes, students; oversee usage and reporting | Oversight and value-for-money |
| Parent | *Out of scope (v1)* | — | (Deliberately excluded for now) |

---

## 5. Market context (Uzbekistan)

This shapes both the strategy and the risks below, so it's worth stating plainly.

**State schools are largely served by an existing official platform.** eMaktab, built by Kundalik, is the unified digital education platform of the Ministry of Preschool and School Education of Uzbekistan, and it has been rolled out across all regions of the country. It already covers schedules, grades, homework, and creative assignments, and its monitoring tools include tests, statistics, and reports. Importantly for pricing: the platform is funded by Kundalik itself, not the state budget — so state schools get a comparable, government-backed tool for free.

**The private learning-center segment is a different story** — fragmented, fast-growing, and largely outside that official platform. The sector is formalizing (an Association of Learning Centers is being established in Uzbekistan), and individual centers run at real scale (one Tashkent center reports over 4,500 monthly learners). These centers — IELTS/SAT, language, IT, and exam-prep — buy their own tools and care intensely about measurable student outcomes.

**What this means for Dwelve:** private learning centers are the strongest place to start; state schools are already covered by a free, official tool. This directly affects the "target both equally" decision (see Risks).

---

## 6. Scope

**In scope (MVP)**
- Online test/exam builder with multiple question types (multiple choice, true/false, short answer)
- Reusable question banks
- **AI: upload a PDF test → get a ready, editable digital test**
- Online test-taking for students in the browser
- Automatic grading for objective questions; manual grading flow for open answers
- **Post-test answer review for students**
- **AI: per-question explanations for students (usage-limited on the free plan)**
- Homework assignment and submission (Google-Classroom-style, more flexible)
- Teacher dashboard: results, score history, progress graphs, per-student detail
- Class/student management; admin oversight
- Trilingual interface: Uzbek (Latin), Russian, English

**Out of scope (v1)**
- Parent accounts/portal
- Native mobile apps (web-first, responsive)
- Integration with Kundalik/eMaktab or government systems
- Live video lessons

**A note on focus:** the platform is meant to serve both schools and learning centers, but the *first* customers should be private learning centers. Trying to win both segments at once spreads a small team too thin — and the school segment is the harder one, because a free official platform already covers it. Win the learning-center segment first, then expand.

---

## 7. Core features and priority

| # | Feature | Priority | Notes |
|---|---|---|---|
| 1 | Reusable question banks | P0 | Tag by subject, topic, difficulty; reuse across tests |
| 2 | Student progress analytics & graphs | P0 | Per-student and per-class trends over time |
| 3 | Auto-grading & instant results | P0 | Objective Qs instant; open Qs flagged for review |
| 4 | Online exam delivery | P0 | Timed sessions, question shuffling, autosave |
| 5 | **AI PDF-to-test generation** | **P0** | Teacher uploads a PDF → AI produces an editable, ready test. Major onboarding win and fills question banks fast |
| 6 | **Post-test answer review** | **P0** | Student sees correct answers after submission |
| 7 | **"Ask AI" question explanations** | **P1** | Per-question AI explanation. Free plan limited by quota/time window; premium unlocks more |
| 8 | Homework assign/submit | P1 | More flexible than Google Classroom (file types, deadlines, re-submission rules) |
| 9 | Exam integrity / anti-cheating | P0 | For online exams this matters more than it first appears — see Risks |
| 10 | Roles & class management | P0 | Teacher / student / admin |
| 11 | Trilingual UI (uz-Latin/ru/en) | P0 | Table-stakes for this market |
| 12 | Local payments & freemium gating | P1 | Uzcard/Humo via Payme/Click for the premium tier |

---

## 8. What makes Dwelve different

This is the honest answer to "why would a center choose Dwelve over Google Forms, Quizizz, or the free official platform?"

- **Upload a PDF, get a ready test.** Teachers don't rebuild their existing paper tests from scratch — they import them in seconds. This removes the biggest reason people abandon new tools (setup effort) and quickly fills the question banks.
- **AI explanations turn a test into a learning moment.** A student doesn't just see a wrong answer — they can ask why, in their own language. That's something the lightweight free tools don't do.
- **Depth of analytics.** Per-student progress over time, not just a score on one quiz — exactly what outcome-focused exam-prep centers care about.
- **Built for the local market.** Trilingual (Uzbek-Latin, Russian, English) and local payment methods from day one.

These advantages are stronger than generic feature lists because the AI-PDF and AI-explanation pieces are harder to copy and locally useful. The main caution: they depend on the AI working well in Uzbek and on PDF parsing being accurate (see Risks).

---

## 9. Key user flows

**Test creation → result (manual)**
1. Teacher creates a test, pulling questions from the bank or adding new ones.
2. Teacher sets rules (time limit, shuffle, attempts) and assigns to a class.
3. Students log in, take the test in-browser; answers autosave.
4. Objective questions grade instantly; open questions queue for the teacher.
5. Results publish to students; the teacher's dashboard updates progress graphs and per-student history.

**Test creation from PDF (AI)**
1. Teacher uploads a PDF of an existing test.
2. AI parses it into questions, options, and answers.
3. Teacher reviews and edits the generated test (required step — never auto-published).
4. Teacher publishes; the test behaves like any other Dwelve test.

**Student review + Ask AI**
1. After submitting, the student sees their score and the correct answers.
2. On any question, the student taps "Ask AI" for a clear explanation.
3. Free users have a limited number of explanations (or a limited time window); premium users get more.

---

## 10. Monetization

Freemium. A free tier drives adoption and trust; a paid premium tier unlocks scale and advanced capability.

- **Free:** core test creation, limited question-bank size or student count, basic results, post-test answer review, and a **capped number of "Ask AI" explanations** (per week/month).
- **Premium (paid):** large/shared question banks, advanced analytics, exam integrity tools, higher limits, admin reporting, and **expanded or unlimited "Ask AI"** explanations.
- **Billing:** monthly/annual per center or per active student, via local rails (Payme/Click, Uzcard/Humo). To be validated.

The "Ask AI" cap does double duty: it's a clear, visible reason to upgrade, *and* it controls the real per-use cost of AI calls.

---

## 11. Non-functional requirements

- **Localization:** full Uzbek (Latin), Russian, English; Uzbek-Cyrillic optional later.
- **Performance:** must hold up when a full class takes an exam simultaneously; autosave to prevent lost answers on weak connections.
- **Reliability/integrity:** exam sessions must survive brief disconnects; results must be tamper-resistant.
- **Accessibility:** usable on low-to-mid-range devices and average local bandwidth.

**AI-specific requirements**
- AI explanations and PDF parsing must work across Uzbek, Russian, and English. Explanation quality in **Uzbek especially** should be tested, since AI model quality varies by language.
- PDF-to-test must always include a **teacher review-and-edit step** before publishing — never auto-publish a parsed test blind, especially with math, images, or Uzbek/Cyrillic text where parsing can slip.
- AI calls have a real per-use cost, so free-tier limits are both a sales lever and a cost-control measure. Set clear per-user limits.

---

## 12. Success metrics

- Centers onboarded; free → paid conversion rate.
- Weekly active teachers and tests created per teacher.
- Share of tests created via PDF upload (measures whether that onboarding lever works).
- "Ask AI" usage and its effect on free → paid conversion.
- Exams delivered online (and estimated paper displaced).
- Grading time saved per teacher.
- Retention at 1 and 3 months.

---

## 13. Risks and open questions

- **Focus risk (highest):** going after state schools and learning centers "equally" splits a small team's effort across a free, official incumbent (eMaktab/Kundalik) and a winnable private market. Recommendation: lead with private learning centers; treat state schools as a later, secondary move.
- **Anti-cheating deserves more weight than it was first given.** Exams are fully online, and exam-prep centers sell credibility — results nobody trusts have little value. Recommendation: include basic integrity controls (tab-switch detection, question shuffling, randomized banks, time limits) in the MVP.
- **AI quality and PDF parsing.** The two AI features are now core differentiators, so they have to work. Risks: weaker AI output in Uzbek, and imperfect PDF parsing (math, images, mixed scripts). The mandatory teacher review step is the safety net.
- **Question-bank cold start — largely solved.** Empty banks were a real worry; PDF-to-test plus seeded banks for popular subjects/exams mostly removes it.
- **Free global competitors** (Google Classroom/Forms, Quizizz, Kahoot) cover the light use case. Differentiation must lean on the AI features, analytics depth, and local fit.
- **Open questions:** Pricing unit (per student vs per center)? Which subjects/exams to seed first? Uzbek-Cyrillic at launch or later? How many free "Ask AI" uses strikes the right balance between value and cost?

---

## 14. Suggested roadmap

- **Phase 1 (MVP):** question bank, test builder, **AI PDF-to-test**, online delivery, auto-grading, **post-test answer review**, basic analytics, trilingual UI, pilot with 3–5 Tashkent learning centers.
- **Phase 2:** **"Ask AI" explanations**, exam integrity tools, premium tier + local payments, richer analytics, homework workflows.
- **Phase 3:** regional expansion, deeper admin reporting, evaluate the state-school move and parent visibility.

---

## 15. Uzbekistan market rating

> Note: this section is a light business case, not part of the core PRD. It's included because it's useful for early decisions.

**Overall: 7 / 10** — a real, timely opportunity with a clear winnable segment and now-stronger, harder-to-copy AI features. Held back mainly by the unfocused targeting choice and execution risk on the AI.

| Dimension | Score | Reasoning |
|---|---|---|
| Market need / pain | **8/10** | Paper-based testing and manual grading are genuine, widespread pains; digitization is already underway nationally. |
| Timing | **8/10** | Government push on digital education + a growing, formalizing private-center sector make this the right moment. |
| Winnable segment (learning centers) | **7.5/10** | Underserved by the official platform, willing to pay, outcome-focused — a strong place to start. |
| What makes it different | **6.5/10** | AI PDF-to-test and AI explanations are harder to copy and locally valuable — up from before, but they must work in practice. |
| Current targeting choice ("both equally") | **5/10** | Splitting effort into the state-school segment — covered by a free, official platform — dilutes a small team's focus. |
| Monetization fit | **7/10** | Freemium suits try-first local behavior, and "Ask AI" is a clean upgrade hook; still needs local payment rails and a validated price. |
| Execution risk | **6/10** | Online exams at scale + integrity + trilingual AI quality + PDF parsing is a meaningful build for an early team. |

**Bottom line for Uzbekistan:** The concept is sound, well-timed, and now more distinctive thanks to the AI features. To push toward an 8/10: **focus on private learning centers first**, make sure **exam integrity** is in the MVP despite its low initial ranking, and **prove the AI works well in Uzbek** (both explanations and PDF parsing). Do those and the rating rises; chase state schools head-on against a free official platform and it falls back toward 5.