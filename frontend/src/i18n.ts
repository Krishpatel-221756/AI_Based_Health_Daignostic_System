import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import fr from './locales/fr.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      hi: { translation: hi },
      fr: { translation: fr },
      gu: { translation: gu },
      pa: { translation: pa },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      ml: { translation: ml },
      mr: { translation: mr }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
