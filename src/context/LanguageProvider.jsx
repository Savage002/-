import { useState, useCallback } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from '../translations';

function loadStoredLanguage() {
    const stored = localStorage.getItem('language');
    return stored && ['ru', 'kk'].includes(stored) ? stored : 'kk';
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(loadStoredLanguage);

    const switchLanguage = useCallback((lang) => {
        if (['ru', 'kk'].includes(lang)) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    }, []);

    const t = useCallback((key) => translations[language][key] || key, [language]);

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
