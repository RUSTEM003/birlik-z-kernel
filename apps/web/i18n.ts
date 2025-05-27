import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';
import kkTranslation from './locales/kk/translation.json';
import uzTranslation from './locales/uz/translation.json';
import trTranslation from './locales/tr/translation.json';
import arTranslation from './locales/ar/translation.json';
import zhTranslation from './locales/zh/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  kk: {
    translation: kkTranslation,
  },
  uz: {
    translation: uzTranslation,
  },
  tr: {
    translation: trTranslation,
  },
  ar: {
    translation: arTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['path', 'cookie', 'navigator'],
      caches: ['cookie'],
    },
  });

export default i18n;
