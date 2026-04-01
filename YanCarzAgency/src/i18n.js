import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import arTranslation from './locales/ar/translation.json';

const LANG_KEY = 'yancarz_lang';

const savedLang = localStorage.getItem(LANG_KEY) || 'en';

// Apply direction and lang attribute on startup
const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

applyLang(savedLang);

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            fr: { translation: frTranslation },
            ar: { translation: arTranslation },
        },
        lng: savedLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

// Hook into language change to persist and update DOM
i18n.on('languageChanged', (lang) => {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
});

export default i18n;
