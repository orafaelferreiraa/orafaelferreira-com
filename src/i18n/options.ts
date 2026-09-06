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
  interpolation: {
    escapeValue: false,
  },
};
