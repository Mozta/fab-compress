import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header({ darkMode, onToggleDarkMode }) {
  const { t, language, setLanguage, languages } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="flex items-center justify-between py-8 md:py-12">
      <div className="flex-1" />

      {/* Center logo + title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <img
            src="/logo.svg"
            alt="FabCompress"
            className="w-12 h-12 rounded-xl shadow-lg shadow-fab-500/30"
          />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fab-300 to-fab-500 bg-clip-text text-transparent">
            FabCompress
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          {t('header.subtitle')}
        </p>
      </div>

      <div className="flex-1 flex justify-end gap-2">
        {/* Language selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu((v) => !v)}
            className="relative w-11 h-11 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-500/50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-lg"
            aria-label={t('language.label')}
            title={t('language.label')}
          >
            {languages.find((l) => l.code === language)?.flag || '🌐'}
          </button>

          {/* Dropdown */}
          {showLangMenu && (
            <div className="absolute right-0 top-full mt-2 bg-surface-700 border border-surface-500/50 rounded-xl overflow-hidden shadow-xl shadow-black/30 z-50 min-w-[140px] animate-fade-in-up" style={{ animationDuration: '150ms' }}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors duration-150 ${
                    language === lang.code
                      ? 'bg-fab-500/20 text-fab-400'
                      : 'text-gray-300 hover:bg-surface-600 hover:text-white'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <div className="relative group/toggle">
          <button
            onClick={onToggleDarkMode}
            className="relative w-11 h-11 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-500/50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={darkMode ? t('header.lightModeAria') : t('header.darkModeAria')}
          >
            {/* Sun icon */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-300 ${
                darkMode
                  ? 'opacity-0 rotate-90 scale-0'
                  : 'opacity-100 rotate-0 scale-100 text-amber-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {/* Moon icon */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-300 ${
                darkMode
                  ? 'opacity-100 rotate-0 scale-100 text-fab-400'
                  : 'opacity-0 -rotate-90 scale-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          {/* Hover tooltip */}
          <span className="absolute -bottom-8 right-0 px-2 py-1 rounded-md bg-surface-700 border border-surface-500/50 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-200 pointer-events-none">
            {darkMode ? t('header.lightMode') : t('header.darkMode')}
          </span>
        </div>
      </div>
    </header>
  );
}
