import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
];

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    return (
        <div className="lang-switcher">
            {LANGUAGES.map(({ code, label }) => (
                <button
                    key={code}
                    className={`lang-btn${currentLang === code ? ' lang-btn--active' : ''}`}
                    onClick={() => i18n.changeLanguage(code)}
                    aria-label={t('languages.switchTo', { lang: t(`languages.${code}`) })}
                    title={t('languages.switchTo', { lang: t(`languages.${code}`) })}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
