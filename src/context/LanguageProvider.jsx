import { useState, useCallback } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from '../translations';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('kk');

    const switchLanguage = useCallback((lang) => {
        if (['ru', 'kk'].includes(lang)) {
            setLanguage(lang);
        }
    }, []);

    const t = useCallback((key) => translations[language][key] || key, [language]);

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
