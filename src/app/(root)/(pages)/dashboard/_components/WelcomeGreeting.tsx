"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

type WelcomeGreetingProps = {
  fullName: string | null;
};

function getFirstName(fullName: string | null): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0];
}

const slideUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function WelcomeGreeting({ fullName }: Readonly<WelcomeGreetingProps>) {
  const { t, i18n } = useTranslation();

  const greetingKey = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "root.dashboard.greeting.morning";
    if (hour < 17) return "root.dashboard.greeting.afternoon";
    return "root.dashboard.greeting.evening";
  }, []);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.language, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [i18n.language],
  );

  const firstName = getFirstName(fullName);

  return (
    <div className="flex flex-col gap-1.5 pb-2">
      <motion.p
        variants={slideUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-sm font-medium tracking-wide text-[var(--muted-foreground)]"
      >
        {t(greetingKey)}{firstName ? "," : ""}
      </motion.p>

      {firstName ? (
        <motion.h1
          variants={slideUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl font-bold tracking-tight text-[var(--primary)]"
        >
          {firstName}
        </motion.h1>
      ) : null}

      <motion.span
        variants={slideUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex w-fit items-center rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]"
      >
        {dateLabel}
      </motion.span>
    </div>
  );
}
