import type { InitOptions } from 'i18next';
import ptBR from './locales/pt-BR';
import en from './locales/en';

export const DEFAULT_LANGUAGE = 'pt-BR';

/**
 * Environment-agnostic i18next options shared by the browser entry
 * (src/i18n/config.ts, adds the language detector) and the build-time
 * prerender (src/entry-server.tsx, forces pt-BR).
 */
export const i18nOptions: InitOptions = {
  resources: {
    en,
    'pt-BR': ptBR,
  },
  fallbackLng: DEFAULT_LANGUAGE,
  // Only these two languages exist. Without this, a browser reporting "en-US" or
  // "es-ES" is kept verbatim as `i18n.language` (translations still resolve via
  // fallbackLng, but `document.documentElement.lang` and any `.startsWith("pt")`
  // check downstream would see the raw, un-normalized tag instead of "en"/"pt-BR").
  // Do NOT add `nonExplicitSupportedLngs: true` here: combined with an explicit
  // `lng` (as src/entry-server.tsx sets for the prerender), it silently breaks
  // every `t()` lookup, returning the raw key instead of a translation.
  supportedLngs: [DEFAULT_LANGUAGE, 'en'],
  interpolation: {
    escapeValue: false,
  },
};
