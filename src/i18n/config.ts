import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, i18nOptions } from './options';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nOptions,
    detection: {
      // Allow URL override (?lang=en), then persist in localStorage, then fall back to browser language
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    }
  });

// Sync <html lang> with current language for SEO/Accessibility
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language || DEFAULT_LANGUAGE;
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
