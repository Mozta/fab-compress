import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { translations, supportedLanguages } from './translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'fabcompress-lang';

function detectLanguage() {
  // Check localStorage first (user's manual choice)
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;

  // Auto-detect from browser
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Match to a supported language, default to English
  return translations[langCode] ? langCode : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectLanguage);

  const setLanguage = useCallback((code) => {
    if (translations[code]) {
      setLanguageState(code);
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  // Update <html lang> attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value ?? key; // fallback: show the key if missing
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, languages: supportedLanguages }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
