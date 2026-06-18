/** Canonical product name — import this everywhere instead of using the raw string. */
export const BRAND_NAME = "Dwelve" as const;

/**
 * Tailwind classes applied to the wordmark text inside DwelveLogo.
 * Uses DM Serif Display (`font-serif`) — the "royalty" display serif reserved for the Dwelve
 * wordmark per the design system. Kept here so the wordmark style is identical everywhere.
 */
export const BRAND_WORDMARK_CLASSES = "font-serif leading-none" as const;
