import {
  BarChart3,
  ChartNoAxesCombined,
  FileQuestion,
  Hourglass,
  MonitorSmartphone,
  Share2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import type {
  LandingAccordionItem,
  LandingChartBar,
  LandingFeatureItem,
  LandingFooterLink,
  LandingNavItem,
  LandingStepItem,
} from "../_types";

export const landingNavItems: LandingNavItem[] = [
  { labelKey: "landing.nav.features", target: "features" },
  { labelKey: "landing.nav.howItWorks", target: "how-it-works" },
  { labelKey: "landing.nav.accordion", target: "accordion" },
];

export const landingFooterLinks: LandingFooterLink[] = [
  { labelKey: "landing.footer.about", href: "/" },
  { labelKey: "landing.footer.contact", href: "/" },
  { labelKey: "landing.footer.support", href: "mailto:support@dwelve.app" },
  { labelKey: "landing.footer.privacy", href: "/" },
  { labelKey: "landing.footer.terms", href: "/" },
];

export const avatarColors = [
  "bg-indigo-300",
  "bg-emerald-300",
  "bg-amber-300",
  "bg-rose-300",
];

export const chartBars: LandingChartBar[] = [
  { height: "42%", color: "bg-indigo-200 dark:bg-indigo-400/40" },
  { height: "60%", color: "bg-indigo-300 dark:bg-indigo-400/60" },
  { height: "34%", color: "bg-indigo-200 dark:bg-indigo-400/40" },
  { height: "78%", color: "bg-indigo-400 dark:bg-indigo-400/80" },
  { height: "52%", color: "bg-indigo-300 dark:bg-indigo-400/60" },
  { height: "94%", color: "bg-[#4F46E5]" },
];

export const trustedInstitutions = ["Stanford", "MIT", "Harvard", "Oxford", "Yale"];

export const landingFeatures: LandingFeatureItem[] = [
  {
    titleKey: "landing.features.instantGradingTitle",
    descriptionKey: "landing.features.instantGradingDesc",
    icon: TrendingUp,
    tile: "bg-indigo-100 text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  {
    titleKey: "landing.features.timedExamsTitle",
    descriptionKey: "landing.features.timedExamsDesc",
    icon: Hourglass,
    tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    titleKey: "landing.features.insightsTitle",
    descriptionKey: "landing.features.insightsDesc",
    icon: BarChart3,
    tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    titleKey: "landing.features.anyDeviceTitle",
    descriptionKey: "landing.features.anyDeviceDesc",
    icon: MonitorSmartphone,
    tile: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  {
    titleKey: "landing.features.questionBankTitle",
    descriptionKey: "landing.features.questionBankDesc",
    icon: FileQuestion,
    tile: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  },
];

export const landingSteps: LandingStepItem[] = [
  {
    step: "01",
    titleKey: "landing.howItWorks.createTitle",
    descriptionKey: "landing.howItWorks.createDesc",
    icon: ShieldCheck,
  },
  {
    step: "02",
    titleKey: "landing.howItWorks.shareTitle",
    descriptionKey: "landing.howItWorks.shareDesc",
    icon: Share2,
  },
  {
    step: "03",
    titleKey: "landing.howItWorks.resultsTitle",
    descriptionKey: "landing.howItWorks.resultsDesc",
    icon: ChartNoAxesCombined,
  },
];

export const landingAccordionItems: LandingAccordionItem[] = [
  {
    key: "item1",
    questionKey: "landing.accordion.item1.question",
    answerKey: "landing.accordion.item1.answer",
  },
  {
    key: "item2",
    questionKey: "landing.accordion.item2.question",
    answerKey: "landing.accordion.item2.answer",
  },
  {
    key: "item3",
    questionKey: "landing.accordion.item3.question",
    answerKey: "landing.accordion.item3.answer",
  },
  {
    key: "item4",
    questionKey: "landing.accordion.item4.question",
    answerKey: "landing.accordion.item4.answer",
  },
];
