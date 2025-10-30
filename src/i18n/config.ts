import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptBR from './locales/pt-BR';
import en from './locales/en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      'pt-BR': ptBR
    },
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    },
    detection: {
      // Allow URL override (?lang=en), then persist in localStorage, then fall back to browser language
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    }
  });

export default i18n;
