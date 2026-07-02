"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, MessageSquareQuote, PencilLine, Sparkle } from "lucide-react";

import BrandButton from "@/components/Custom/BrandButton";

// Lazy, client-only: the three.js scene is its own chunk and never blocks paint.
// The CSS glow behind it stays visible while it loads and if WebGL is missing.
const HeroScene = dynamic(() => import("../_components/HeroScene"), { ssr: false });

const USE_CASES = ["quizzes", "placement", "mock", "homework", "finals", "progress"] as const;
const TEACHER_SIGNAL_ITEMS = ["review", "edit", "publish"] as const;

function MainPage() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <section id="home" className="w-full scroll-mt-24 px-4 pb-12 pt-14 md:pt-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <motion.div className="flex flex-col items-start text-left" {...fade(0)}>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {t("landing.main.badge")}
          </span>

          <h1 className="mt-6 max-w-xl text-balance text-[clamp(2.5rem,6vw,3.85rem)] font-bold leading-[1.05] tracking-[-0.02em] text-foreground">
            {t("landing.main.title")}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("landing.main.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandButton href="/signup" variant="primary" size="lg">
              {t("landing.main.primaryCta")}
            </BrandButton>
            <BrandButton href="/login" variant="secondary" size="lg" withArrow>
              {t("landing.main.secondaryCta")}
            </BrandButton>
          </div>

          {/* <TeacherFeedbackSignal /> */}
        </motion.div>

        {/* Right: 3D hero scene (PDF → drafted questions) */}
        <motion.div className="relative" {...fade(0.15)}>
          <div className="relative mx-auto aspect-square w-full max-w-[540px] overflow-hidden sm:aspect-[5/4] lg:aspect-square">
            {/* Brand glow / WebGL fallback backdrop */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(123,97,255,0.22),transparent_72%)] dark:bg-[radial-gradient(60%_55%_at_50%_45%,rgba(142,120,255,0.30),transparent_72%)]"
            />
            {/* Labels are drawn onto the 3D card faces themselves (see HeroScene),
                so the narrative reads as part of the model, not as floating tags. */}
            <HeroScene
              className="absolute inset-0 h-full w-full"
              labels={{
                document: t("landing.main.scene.tagDocument"),
                draft: t("landing.main.scene.tagDraft"),
                ready: t("landing.main.scene.tagReady"),
                editable: t("landing.main.scene.tagEditable"),
              }}
            />
            <span className="sr-only">{t("landing.main.scene.alt")}</span>
          </div>
        </motion.div>
      </div>

      {/* School / learning-center positioning band — a flowing ribbon of real use
          cases. The continuous scroll reads as "and everything in between". */}
      <SchoolsBand reduceMotion={!!shouldReduceMotion} />
    </section>
  );
}

function TeacherFeedbackSignal() {
  const { t } = useTranslation();

  return (
    <div className="mt-9 w-full max-w-xl rounded-sm border border-border/80 bg-card/80 p-3.5">
      <div className="grid gap-4 sm:grid-cols-[7.5rem_1fr] sm:items-center">
        <div className="relative h-[5.75rem] overflow-hidden rounded-sm border border-border bg-secondary/70">
          <div className="absolute left-4 top-4 h-12 w-16 -rotate-6 rounded-sm border border-border bg-card p-2">
            <span className="block h-1.5 w-8 rounded-sm bg-muted-foreground/25" />
            <span className="mt-2 block h-1 w-11 rounded-sm bg-primary/25" />
            <span className="mt-1.5 block h-1 w-8 rounded-sm bg-muted-foreground/20" />
          </div>

          <div className="absolute bottom-3 left-8 h-12 w-16 rotate-3 rounded-sm border border-primary/25 bg-card p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground">Q4</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            </div>
            <span className="mt-2 block h-1.5 w-10 rounded-sm bg-primary/35" />
            <span className="mt-1.5 block h-1 w-8 rounded-sm bg-muted-foreground/20" />
          </div>

          <div className="absolute right-3 top-3 flex h-10 w-9 items-center justify-center rounded-sm border border-border bg-card text-primary">
            <MessageSquareQuote className="h-4 w-4" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {t("landing.main.socialProof")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t("landing.main.teacherSignal.quote")}
          </p>
        </div>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {TEACHER_SIGNAL_ITEMS.map((item) => (
          <li
            key={item}
            className="flex min-h-9 items-center gap-2 rounded-sm border border-border/70 bg-background/70 px-2.5 py-2 text-xs font-medium text-foreground"
          >
            {item === "edit" ? (
              <PencilLine className="h-3.5 w-3.5 shrink-0 text-primary" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
            )}
            <span className="leading-snug">{t(`landing.main.teacherSignal.${item}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Renders one pass of the use-case ribbon: a violet spark before each phrase. */
function UseCaseItems() {
  const { t } = useTranslation();
  return (
    <>
      {USE_CASES.map((key) => (
        <li key={key} className="flex items-center gap-3 whitespace-nowrap">
          <Sparkle className="h-3.5 w-3.5 shrink-0 text-primary" fill="currentColor" />
          <span className="text-lg font-medium text-foreground/80 sm:text-xl">
            {t(`landing.main.useCases.${key}`)}
          </span>
        </li>
      ))}
    </>
  );
}

function SchoolsBand({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useTranslation();
  const edgeFade = {
    maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
  };

  return (
    <motion.div
      className="mx-auto mt-24 w-full max-w-6xl border-t border-border/60 pt-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
    >
      <p className="mx-auto max-w-2xl text-center text-sm font-medium text-muted-foreground">
        {t("landing.main.schoolsTitle")}
      </p>

      {reduceMotion ? (
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5">
          <UseCaseItems />
        </ul>
      ) : (
        <div className="landing-marquee group relative mt-7 flex overflow-hidden" style={edgeFade}>
          <div className="landing-marquee-track flex w-max items-center">
            <ul className="flex w-max items-center gap-x-10 pr-10">
              <UseCaseItems />
            </ul>
            <ul aria-hidden className="flex w-max items-center gap-x-10 pr-10">
              <UseCaseItems />
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default MainPage;
