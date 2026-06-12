import type { LucideIcon } from "lucide-react";

export type LandingTranslationKey = string;

export interface LandingNavItem {
  labelKey: LandingTranslationKey;
  target: string;
}

export interface LandingFooterLink {
  labelKey: LandingTranslationKey;
  href: string;
}

export interface LandingChartBar {
  height: string;
  color: string;
}

export interface LandingFeatureItem {
  titleKey: LandingTranslationKey;
  descriptionKey: LandingTranslationKey;
  icon: LucideIcon;
  tile: string;
}

export interface LandingStepItem {
  step: string;
  titleKey: LandingTranslationKey;
  descriptionKey: LandingTranslationKey;
  icon: LucideIcon;
}

export interface LandingAccordionItem {
  key: string;
  questionKey: LandingTranslationKey;
  answerKey: LandingTranslationKey;
}

export interface StatCardProps {
  label: string;
  value: string;
  accent?: boolean;
}
